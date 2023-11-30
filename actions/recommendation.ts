"use server";
import natural from "natural";
import Vector from "vector-object";
import Product, { IProduct } from "@/lib/models/products";
import { ObjectId } from "mongodb";

type Product = {
  _id: ObjectId;
  sellerId: {
    _id: ObjectId;
    username: string;
    image: string;
  };
  productType: {
    _id: ObjectId;
    name: string;
  };
  name: string;
  price: number;
  images: string[];
};

type ProductQuery = {
  _id: ObjectId;
  name: string;
  retailPrice: number;
  specialty: boolean;
  images: string[];
  packageOptions: {
    unit: string;
    weight: number;
    price: number;
    length: number;
    width: number;
    height: number;
  }[];
};

type ProductDataItem = {
  _id: string;
  content: string;
};

type ProductData = ProductDataItem[];

const processedDocs: ProductData = [];

export const getProductData = async () => {
  // const productData: ProductData = [];
  const products: IProduct[] = await Product.find({ deleted: false });

  if (products.length > 0) {
    products.map((product: IProduct) => {
      const data: ProductDataItem = {
        _id: "",
        content: "",
      };
      data._id = product._id;
      data.content =
        extractProductDescription(product) +
        ` Giá sản phẩm: ${product?.retailPrice} Số lượng đã bán: ${product?.sold}`;
      processedDocs.push(data);
    });
    return processedDocs;
  }

  return processedDocs;
};

const extractProductDescription = (product: IProduct): string => {
  let result = '';

  product.description.content.map((item) => {
    if (item.type === "text" && item.text) {
      result += `${item.text} `;
    } else {
      if (item.content && item.content.length > 0) {
        item.content.map((i: any) => {
          if (i.type === "text" && i.text) {
            result += `${i.text} `;
          }
        })
      }

    }
  })
  return result;
};

export const createVectorsFromDocs = async () => {
  const processedDocs: ProductData = await getProductData();
  const TfIdf = natural.TfIdf;
  const tfidf = new TfIdf();

  processedDocs.forEach((processedDocument) => {
    tfidf.addDocument(processedDocument.content);
  });

  const documentVectors = [];

  for (let i = 0; i < processedDocs.length; i += 1) {
    const processedDocument = processedDocs[i];
    const obj: { [key: string]: number } = {};

    const items = tfidf.listTerms(i);

    for (let j = 0; j < items.length; j += 1) {
      const item = items[j];
      obj[item.term] = item.tfidf;
    }

    const documentVector = {
      id: processedDocument._id,
      vector: new Vector(obj),
    };

    documentVectors.push(documentVector);
  }
  return documentVectors;
};

export const calcSimilarities = async () => {
  const docVectors = await createVectorsFromDocs();
  // number of results that you want to return.
  const MAX_SIMILAR = 4;
  // min cosine similarity score that should be returned.
  const MIN_SCORE = 0.2;
  const data: { [key: string]: any[] } = {};

  for (let i = 0; i < docVectors.length; i += 1) {
    const documentVector = docVectors[i];
    const { id } = documentVector;

    data[id] = [];
  }

  for (let i = 0; i < docVectors.length; i += 1) {
    for (let j = 0; j < i; j += 1) {
      const idi = docVectors[i].id;
      const vi = docVectors[i].vector;
      const idj = docVectors[j].id;
      const vj = docVectors[j].vector;
      const similarity = vi.getCosineSimilarity(vj);

      // if (similarity > MIN_SCORE) {
      //   data[idi].push({ id: idj, score: similarity });
      //   data[idj].push({ id: idi, score: similarity });
      // }
      data[idi].push({ id: idj, score: similarity });
      data[idj].push({ id: idi, score: similarity });
    }
  }

  Object.keys(data).forEach((id) => {
    data[id].sort((a, b) => b.score - a.score);

    if (data[id].length > MAX_SIMILAR) {
      data[id] = data[id].slice(0, MAX_SIMILAR);
    }
  });

  return data;
};

export const getSimilarDocuments = async (_id: string) => {
  if (!_id) {
    return [];
  }
  const trainedData = await calcSimilarities();
  let similarDocuments = trainedData[_id];

  if (similarDocuments === undefined) {
    return [];
  }

  return similarDocuments;
};

export const getSimilarProducts = async (
  _id: string
): Promise<IProductsResponse> => {
  const productSimilarList = await getSimilarDocuments(_id);

  if (productSimilarList.length <= 0) {
    return {
      products: [],
      totalPages: 0,
    };
  }

  const productIds = productSimilarList.map((item) => item.id);
  try {
    const products: ProductQuery[] = await Product.find({ _id: { $in: productIds } })
      .select("name images retailPrice specialty packageOptions");

    if (products && products.length > 0) {
      const formattedProducts = products.map(
        (product): {
          _id: string;
          productName: string;
          productImages: string[];
          productPrice: number;
          specialty: boolean;
        } => {
          let productPrice = product.retailPrice;
          if (!productPrice || productPrice === 0) {
            const minPrice = Math.min(
              ...product.packageOptions.map((option) => option.price)
            );
            productPrice = minPrice;
          }
          return {
            _id: product._id?.toString(),
            productName: product.name,
            productImages: product.images,
            productPrice: productPrice,
            specialty: product.specialty,
          };
        }
      );
      return {
        products: formattedProducts,
      };
    } else {
      return {
        products: [],
      };
    }
  } catch (error) {
    console.error("Lỗi truy vấn sản phẩm:", error);
    return {
      products: [],
    };
  }
};

export const getRecommentdation = async (id: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/recommendation/${id}`
    );
    const data: IProductsResponse = await res.json();
    return data;
  } catch (error) {
    console.log(error);
    return {
      products: [],
    };
  }
};
