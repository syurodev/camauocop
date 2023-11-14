"use server"

import ProductType from "@/lib/models/productTypes";
import Product from "@/lib/models/products";
import Shop from "@/lib/models/shop";
import { connectToDB } from "@/lib/utils"
import Specialty, { ISpecialty } from "@/lib/models/specialty"

export interface ProductTypeData {
  _id: string;
  name: string;
}

export interface ProductData {
  _id: string;
  name: string;
  image: string;
  shopName: string;
  specialty: boolean;
}

export interface ShopData {
  _id: string;
  name: string;
  image: string;
  type: ShopType
}

export interface SearchResponse {
  code: number;
  message: string;
  data: {
    productTypes: ProductTypeData[],
    products: ProductData[],
    shops: ShopData[],
    specialtys: ProductTypeData[],
  } | null
}

export const search = async (value: string): Promise<SearchResponse> => {
  try {
    await connectToDB()
    const productTypes = await ProductType.aggregate([
      { $match: { name: { $regex: value, $options: 'i' } } },
      {
        $group: {
          _id: '$name',
          firstId: { $first: '$_id' },
          name: { $first: '$name' },
        },
      },
      { $project: { _id: '$firstId', name: 1 } },
      { $limit: 5 },
    ]).exec();

    const specialtys = await Specialty.find({
      name: { $regex: value, $options: "i" },
    }).limit(5)

    const products = await Product.find({ name: { $regex: value, $options: 'i' } })
      .populate({
        path: 'shopId',
        select: "name"
      })
      .limit(5)
      .exec();
    const shops = await Shop.find({ status: 'active', name: { $regex: value, $options: 'i' } })
      .limit(5)
      .exec();

    let formattedShops: ShopData[] = []
    let formattedProducts: ProductData[] = []
    let formattedProductTypes: ProductTypeData[] = []
    let formattedSpecialtys: ProductTypeData[] = []

    if (specialtys.length > 0) {
      formattedSpecialtys = specialtys.map((item) => ({
        _id: item._id.toString(),
        name: item.name,
      }));
    }

    if (productTypes.length > 0) {
      formattedProductTypes = productTypes.map((type) => ({
        _id: type._id.toString(),
        name: type.name,
      }));
    }

    if (shops.length > 0) {
      formattedShops = shops.map((shop) => ({
        _id: shop._id.toString(),
        name: shop.name,
        image: shop.image,
        type: shop.type
      }));
    }

    if (products.length > 0) {
      formattedProducts = products.map((product) => ({
        _id: product._id.toString(),
        name: product.name,
        shopName: product.shopId.name,
        image: product.images[0],
        specialty: product.specialty,
      }));
    }

    return {
      code: 200,
      message: "successfully",
      data: {
        productTypes: formattedProductTypes,
        products: formattedProducts,
        shops: formattedShops,
        specialtys: formattedSpecialtys,
      }
    };

  } catch (error) {
    console.log(error)
    return {
      code: 500,
      message: "Lỗi hệ thống, vui lòng thử lại",
      data: null
    }
  }
}