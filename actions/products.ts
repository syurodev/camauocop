'use server'

import Product from "@/lib/models/products"
import ProductType from "@/lib/models/productTypes";
import { type IAddProductZodSchema } from '@/lib/zodSchema/products';
import { type IAddProductTypes } from "@/lib/interface/interface";

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
    const productTypes: IAddProductTypes[] = await ProductType.find()

    if (productTypes.length > 0) {
      return productTypes
    } else {
      return []
    }
  } catch (error) {
    console.log(error)
    return []
  }
}