"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { ObjectId } from "mongodb";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { connectToDB } from "@/lib/utils";
import Product, { IProduct } from "@/lib/models/products";
import ProductType from "@/lib/models/productTypes";
import { type IAddProductZodSchema } from "@/lib/zodSchema/products";
import { type IAddProductTypeZodSchema } from "@/lib/zodSchema/products";
import { convertToKg } from "@/lib/convertToKg";

type Product = {
  _id: ObjectId;
  name: string;
  retailPrice: number;
  images: string[];
};

export async function addProduct(data: IAddProductZodSchema) {
  try {
    await connectToDB();

    const product = new Product(data);
    const quantity = convertToKg(product.quantity, data.unit)
    product.quantity = quantity

    await product.save();
    return {
      code: 200,
      message: `Thêm sản phẩm ${product.name} thành công`
    }
  } catch (error) {
    console.log(error);
    return {
      code: 500,
      message: "Lỗi hệ thống vui lòng thử lại"
    }
  }
}

export async function getProductTypes() {
  try {
    await connectToDB();

    const session = await getServerSession(authOptions);

    if (session) {
      const productTypes: IAddProductTypes[] = await ProductType.find({
        shopId: session?.user.shopId,
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
      shopId: data.shopId,
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
      .select("name images retailPrice"); // select name, images, and price of the product

    if (products && products.length > 0) {
      // Format the data
      const formattedProducts = products.map(
        (product: Product): IProducts => {
          return {
            _id: product._id?.toString(),
            productName: product.name,
            productImages: product.images,
            productPrice: product.retailPrice,
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

export async function getProductDetail(_id: string): Promise<IProductDetail | null> {
  try {
    await connectToDB();
    const product = await Product.findById(_id)
      .populate({
        path: "shopId",
        select: "name _id delivery shop_id address",
        populate: {
          path: "auth",
          select: "username image _id",
        },
      })
      .populate({
        path: "productType",
        select: "name _id",
      });

    if (!product) {
      return null;
    }

    // Format the data
    const formattedProduct: IProductDetail = {
      _id: product._id.toString(),
      productName: product.name,
      productDescription: product.description,
      retail: product.retail,
      packageOptions: product.packageOptions,
      productPrice: product.retailPrice,
      productSold: product.sold || 0,
      productQuantity: product.quantity,
      productImages: product.images,
      productCreatedAt: product.createdAt,
      productDeletedAt: product.deleteAt,
      shopName: product.shopId.username || "block user",
      shopId: product.shopId._id.toString() || "",
      sellerId: product.shopId.auth._id.toString() || "",
      sellerName: product.shopId.auth.username || "block user",
      sellerAvatar: product.shopId.auth.image || "",
      productTypeName: product.productType.name.toString(),
      productTypeId: product.productType._id.toString(),
      shopInfo: {
        delivery: product.shopId.delivery,
        address: product.shopId.address,
        shop_id: product.shopId.shop_id,
      }
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
      .select("name images price");

    if (products && products.length > 0) {
      // Format the data
      const formattedProducts = products.map(
        (product: Product): IProducts => {
          return {
            _id: product._id?.toString(),
            productName: product.name,
            productImages: product.images,
            productPrice: product.retailPrice,
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
