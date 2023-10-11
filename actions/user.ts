"use server"

import User from "@/lib/models/users"
import { connectToDB, verifyJwtToken } from "@/lib/utils"

export const updatePhone = async (phone: string, id: string, accessToken: string) => {
  try {
    await connectToDB()

    const verifyToken = verifyJwtToken(accessToken)

    if (!!verifyToken) {
      const existingUser = await User.findOne({ _id: { $ne: id }, phone: phone });

      if (existingUser) {
        return {
          code: 400,
          message: "Số điện thoại đã tồn tại"
        }
      }

      const updatedUser = await User.findByIdAndUpdate(id, { phone: phone }, { new: true });

      if (!updatedUser) {
        return {
          code: 404,
          message: "Không tìm thấy người dùng"
        };
      }

      return {
        code: 200,
        message: "Cập nhật số điện thoại thành công"
      };
    } else {
      return {
        code: 401,
        message: "Không được phép thực hiện chức năng này, vui lòng đăng nhập và thử lại"
      }
    }
  } catch (error) {
    console.log(error)
    return {
      code: 500,
      message: "Lỗi hệ thống vui lòng thử lại"
    }
  }
}