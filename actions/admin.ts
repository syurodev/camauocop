"use server"

import Shop from "@/lib/models/shop"
import { connectToDB, verifyJwtToken } from "@/lib/utils"

export const getShops = async (accessToken: string) => {
  try {
    const token = verifyJwtToken(accessToken)

    if (!!token) {
      await connectToDB()

      const shops = await Shop.find()
        .sort({ createdAt: -1 })
        .populate({
          path: "auth",
          select: "_id username image email"
        })
        .select("_id name status address")

      if (shops.length > 0) {
        const formatShops: IShopsResponse[] = shops.map(item => {
          return {
            _id: item._id.toString(),
            name: item.name,
            status: item.status,
            address: item.address[0].province,
            authId: item.auth._id.toString(),
            username: item.auth.username || item.auth.email,
            image: item.auth.image
          }
        })

        return {
          code: 200,
          messgae: "successfully",
          data: JSON.stringify(formatShops)
        }
      } else {
        return {
          code: 404,
          messgae: "Không tìm thấy bất kỳ shop nào",
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