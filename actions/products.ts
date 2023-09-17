"use server";

import Product from "@/lib/models/products";
import ProductType from "@/lib/models/productTypes";
import { type IAddProductZodSchema } from "@/lib/zodSchema/products";
import { type IAddProductTypeZodSchema } from "@/lib/zodSchema/products";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import { connectToDB } from "@/lib/utils";
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

export async function addProduct(data: IAddProductZodSchema) {
  try {
    await connectToDB();

    const product = new Product(data);
    await product.save();
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function getProductTypes() {
  try {
    await connectToDB();

    const session = await getServerSession(authOptions);

    if (session) {
      const productTypes: IAddProductTypes[] = await ProductType.find({
        userId: session?.user._id,
      });

      if (productTypes.length > 0) {
        const formattedProductTypes = productTypes.map((type) => ({
          _id: type._id.toString(),
          name: type.name,
        }));

        return formattedProductTypes;
      } else {
        return [];
      }
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function addProductType(data: IAddProductTypeZodSchema) {
  try {
    await connectToDB();

    const exittedProductType = await ProductType.findOne({
      userId: data.userId,
      name: { $regex: new RegExp(data.name, "i") },
    });

    if (exittedProductType) {
      return { satus: false, message: "Loại hàng hoá đã tồn tại" };
    }

    const nerProductType = new ProductType(data);
    await nerProductType.save();

    const formattedNewProductType = {
      _id: nerProductType._id.toString(),
      name: nerProductType.name,
    };

    revalidatePath("/products/product/add");
    return {
      satus: true,
      message: "Thêm loại hàng hoá thành công",
      newProductType: formattedNewProductType,
    };
  } catch (error) {
    console.log(error);
    return {
      satus: false,
      message: "Có lỗi trong quá trình thêm loại hàng hoá. Vui lòng thử lại",
    };
  }
}

export async function getProducts(
  page: number = 1
): Promise<IProductsResponse> {
  const limit = 20;
  const skip = (page - 1) * limit;

  try {
    await connectToDB();
    const totalProducts = await Product.countDocuments({});
    const totalPages = Math.ceil(totalProducts / limit);

    const products: Product[] = await Product.find({})
      .sort({ createdAt: -1 }) // sort by newest
      .skip(skip) // skip products for pagination
      .limit(limit) // limit to 20 products per page
      .populate({
        path: "sellerId",
        select: "username image", // select username and image of the seller
      })
      .populate({
        path: "productType",
        select: "name", // select name of the product type
      })
      .select("name images price"); // select name, images, and price of the product

    if (products && products.length > 0) {
      // Format the data
      const formattedProducts = products.map(
        (product: {
          _id: { toString: () => string };
          name: string;
          productType: { name: string };
          sellerId: { username: string; image: string };
          images: string[];
          price: number;
        }): {
          _id: string;
          productName: string;
          productTypeName: string;
          sellerName: string;
          sellerAvatar: string;
          productImages: string[];
          productPrice: number;
        } => {
          return {
            _id: product._id?.toString(),
            productName: product.name,
            productTypeName: product.productType?.name,
            sellerName: product.sellerId?.username,
            sellerAvatar: product.sellerId?.image,
            productImages: product.images,
            productPrice: product.price,
          };
        }
      );
      return {
        products: formattedProducts,
        totalPages,
      };
    } else {
      return {
        products: [],
        totalPages: 0,
      };
    }
  } catch (error) {
    console.log("Lỗi lấy danh sách sản phẩm mới:", error);
    return {
      products: [],
      totalPages: 0,
    };
  }
}

export async function getProductDetail(_id: string) {
  try {
    await connectToDB();

    const product = await Product.findById(_id)
      .populate({
        path: "sellerId",
        select: "username _id image", // select username, _id and image of the seller
      })
      .populate({
        path: "productType",
        select: "name _id", // select name and _id of the product type
      });

    if (!product) {
      return null;
    }

    // Format the data
    const formattedProduct: IProductDetail = {
      _id: product._id.toString(),
      productName: product.name,
      productDescription: product.description,
      productPrice: product.price,
      productQuantity: product.quantity,
      productImages: product.images,
      productCreatedAt: product.createdAt,
      productDeletedAt: product.deleteAt,
      productAuction: product.auction,
      sellerName: product.sellerId.username,
      sellerId: product.sellerId._id,
      sellerAvatar: product.sellerId.image,
      productTypeName: product.productType.name,
      productTypeId: product.productType._id,
    };

    return formattedProduct;
  } catch (error) {
    console.log("Lỗi lấy chi tiết sản phẩm", error);
    return null;
  }
}

export async function searchProducts(
  slug: string,
  page: number
): Promise<IProductsResponse> {
  try {
    await connectToDB();

    const productTypes = await ProductType.find({
      name: { $regex: slug, $options: "i" },
    });

    if (!productTypes || productTypes.length === 0) {
      return {
        products: [],
        totalPages: 0,
      };
    }

    const productTypeIds = productTypes.map((productType) => productType._id);

    const limit = 20;
    const skip = (page - 1) * limit;

    const products: Product[] = await Product.find({
      productType: { $in: productTypeIds },
    })
      .sort({ sold: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "sellerId",
        select: "username image",
      })
      .populate({
        path: "productType",
        select: "name",
      })
      .select("name images price");

    if (products && products.length > 0) {
      // Format the data
      const formattedProducts = products.map(
        (product: {
          _id: { toString: () => string };
          name: string;
          productType: { name: string };
          sellerId: { username: string; image: string };
          images: string[];
          price: number;
        }): {
          _id: string;
          productName: string;
          productTypeName: string;
          sellerName: string;
          sellerAvatar: string;
          productImages: string[];
          productPrice: number;
        } => {
          return {
            _id: product._id?.toString(),
            productName: product.name,
            productTypeName: product.productType?.name,
            sellerName: product.sellerId?.username,
            sellerAvatar: product.sellerId?.image,
            productImages: product.images,
            productPrice: product.price,
          };
        }
      );

      const totalProducts = await Product.countDocuments({
        productType: { $in: productTypeIds },
      });

      const totalPages = Math.ceil(totalProducts / limit);
      return {
        products: formattedProducts,
        totalPages,
      };
    } else {
      return {
        products: [],
        totalPages: 0,
      };
    }
  } catch (error) {
    console.log(error);
    return {
      products: [],
      totalPages: 0,
    };
  }
}
