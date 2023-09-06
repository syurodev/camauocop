'use server'

import Product from "@/lib/models/products"
import ProductType from "@/lib/models/productTypes";
import { type IAddProductZodSchema } from '@/lib/zodSchema/products';
import { type IAddProductTypes } from "@/lib/interface/interface";
import { type IAddProductTypeZodSchema } from "@/lib/zodSchema/products";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next"

export async function addProduct(data: IAddProductZodSchema) {
  try {
    const product = new Product(data)
    await product.save()
    return true
  } catch (error) {
    console.log(error)
    return false
  }
}

export async function getProductTypes() {
  try {
    const session = await getServerSession(authOptions)

    if (session) {
      const productTypes: IAddProductTypes[] = await ProductType.find({ userId: session?.user._id });

      if (productTypes.length > 0) {
        const formattedProductTypes = productTypes.map((type) => ({
          _id: type._id.toString(),
          name: type.name,
        }));

        return formattedProductTypes;
      } else {
        return []
      }
    } else {
      return []
    }
  } catch (error) {
    console.log(error)
    return []
  }
}

export async function addProductType(data: IAddProductTypeZodSchema) {
  try {
    const exittedProductType = await ProductType.findOne({
      userId: data.userId,
      name: { $regex: new RegExp(data.name, 'i') },
    })

    if (exittedProductType) {
      return { satus: false, message: "Loại hàng hoá đã tồn tại" }
    }

    const nerProductType = new ProductType(data)
    await nerProductType.save()

    const formattedNewProductType = {
      _id: nerProductType._id.toString(),
      name: nerProductType.name,
    };

    revalidatePath("/products/product/add")
    return { satus: true, message: "Thêm loại hàng hoá thành công", newProductType: formattedNewProductType }
  } catch (error) {
    console.log(error)
    return { satus: false, message: "Có lỗi trong quá trình thêm loại hàng hoá. Vui lòng thử lại" }
  }
}