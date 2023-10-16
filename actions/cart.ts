"use server"

import Cart, { ICart } from "@/lib/models/carts"
import { connectToDB, verifyJwtToken } from "@/lib/utils"

export const getCartItems = async (userId: string, accessToken: string) => {
  try {
    const token = verifyJwtToken(accessToken)

    if (!!token) {
      const cart: ICart | null = await Cart.findOne({ userId: userId })
      if (cart) {
        return {
          code: 200,
          message: "success",
          data: JSON.stringify(cart)
        }
      } else {
        return {
          code: 404,
          message: "Không tìm thấy giỏ hàng",
          data: null
        }
      }
    } else {
      return {
        status: 401,
        message: "Bạn không có quyền thực hiện chức năng này vui lòng đăng nhập và thử lại",
        data: null
      }
    }

  } catch (error) {
    console.log(error)
    return {
      code: 500,
      message: "Lỗi hệ thống vui lòng thử lại",
      data: null
    }
  }
}

export const deleteCartItems = async (userId: string, accessToken: string, productIds: string[]) => {
  try {
    const token = verifyJwtToken(accessToken)

    if (!!token) {
      await connectToDB()
      const cart: ICart | null = await Cart.findOne({ userId: userId })

      if (cart) {
        const updatedProducts = cart.products.filter((product) => !productIds.includes(product.productId.toString()));

        // Cập nhật giỏ hàng với mảng sản phẩm đã lọc
        await Cart.findOneAndUpdate({ userId }, { products: updatedProducts });

        return {
          code: 200,
          message: "Xoá sản phẩm khỏi giỏ hàng thành công",
        };
      } else {
        return {
          code: 404,
          message: "Không tìm thấy giỏ hàng",
        }
      }
    } else {
      return {
        status: 401,
        message: "Bạn không có quyền thực hiện chức năng này vui lòng đăng nhập và thử lại",
      }
    }
  } catch (error) {
    console.log(error)
    return {
      code: 500,
      message: "Lỗi hệ thống vui lòng thử lại",
    }
  }
}