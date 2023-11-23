"use server"

import { IUserInfoSchema } from "@/components/card/ChangeUserInfo"
import User, { IUser } from "@/lib/models/users"
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

export const changeUserAvatar = async (userId: string, accessToken: string, image: string) => {
  try {
    const token = verifyJwtToken(accessToken)

    if (!!token) {
      await connectToDB()

      const shop = await User.findByIdAndUpdate(userId, { image: image })

      if (shop) {
        return {
          code: 200,
          message: "Thay đổi ảnh đại diện cửa hàng thành công"
        }
      } else {
        return {
          code: 400,
          message: "Thay đổi ảnh đại diện thất bại, vui lòng thử lại"
        }
      }

    } else {
      return {
        code: 401,
        message: "Bạn không có quyền thực hiện chức năng này vui lòng đăng nhập và thử lại"
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

export const changeUserInfo = async (accessToken: string, userId: string, data: IUserInfoSchema) => {
  try {
    const token = verifyJwtToken(accessToken)

    if (!!token) {
      const matchingUserPhones = await User.findOne({
        phone: data.phone,
        _id: { $ne: userId },
      })

      if (matchingUserPhones) {
        return {
          code: 401,
          message: "Số điện thoại đã được sử dụng",
        }
      }

      const matchingUsername = await User.findOne({
        $and: [
          { username: { $ne: "" } },
          { username: data.username },
          { _id: { $ne: userId } }
        ]
      })

      if (matchingUsername) {
        return {
          code: 401,
          message: "Tên đăng nhập đã được sử dụng",
        }
      }

      const shop = await User.findByIdAndUpdate(userId, {
        phone: data.phone,
        username: data.username,
        email: data.email,
      })

      if (shop) {
        return {
          code: 200,
          message: "Thay đổi thông tin người dùng thành công",
        }
      } else {
        return {
          code: 404,
          message: "Không tìm thấy thông tin người dùng",
        }
      }
    } else {
      return {
        code: 401,
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

export const searchUser = async (slug: string, role?: UserRole) => {
  try {
    await connectToDB()

    let query: any = {
      $or: [
        { username: { $regex: slug, $options: "i" } },
        { email: { $regex: slug, $options: "i" } },
        { phone: { $regex: slug, $options: "i" } },
      ],
    };

    if (role) {
      query = { ...query, role: role }
    }

    const users: IUser[] = await User.find(query);

    if (users.length > 0) {
      const result = users.map(user => {
        return {
          _id: user._id.toString() as string,
          username: user.username && user.username !== "" ? user.username : user.email,
          phone: user.phone || "",
          avatar: user.image || ""
        }
      })

      return {
        code: 200,
        message: "successfully",
        data: result
      }
    } else {
      return {
        code: 404,
        message: "Không tìm thấy người dùng",
        data: null
      }
    }

  } catch (error) {
    console.log(error)
    return {
      code: 500,
      message: "Lỗi máy chủ vui lòng thử lại",
      data: null
    }
  }
}