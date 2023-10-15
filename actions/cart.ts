"use server"

import Cart, { ICart } from "@/lib/models/carts"
import { verifyJwtToken } from "@/lib/utils"

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