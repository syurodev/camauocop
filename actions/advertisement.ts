"use server"

import Advertisement, { IAdvertisement } from "@/lib/models/advertisement"
import { connectToDB, verifyJwtToken } from "@/lib/utils"
import { IAdvertisementSchema } from "@/lib/zodSchema/advertisementSchema"

export const createAdvertisement = async (accessToken: string, data: IAdvertisementSchema) => {
  try {
    const token = verifyJwtToken(accessToken)
    if (!!token) {
      const ads = new Advertisement({
        ...data,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate)
      })

      const result = await ads.save()
      if (result) {
        const data: Ads = {
          _id: result._id.toString(),
          image: result.image,
          status: result.status,
          type: result.type,
          note: result.note,
          startDate: result.startDate.toISOString(),
          endDate: result.endDate.toISOString(),
          createdAt: result.createdAt.toISOString(),
        }
        return {
          code: 200,
          message: "Thêm quảng cáo thành công",
          data: data
        }
      } else {
        return {
          code: 400,
          message: "Thêm quảng cáo thất bại vui lòng thử lại"
        }
      }

    } else {
      return {
        code: 400,
        message: "Bạn không có quyền thực hiện chức năng này vui lòng đăng nhập và thử lại"
      }
    }
  } catch (error) {
    console.log(error)
    return {
      code: 500,
      message: "Lỗi server vui lòng thử lại"
    }
  }
}

export const getAdvertisement = async (accessToken: string, shopId: string) => {
  try {
    const token = verifyJwtToken(accessToken)
    if (!!token) {
      await connectToDB()
      const ads: IAdvertisement[] = await Advertisement.find({ shopId: shopId })

      if (ads.length > 0) {
        const result: Ads[] = ads.map(ad => {
          return {
            _id: ad._id.toString(),
            image: ad.image,
            note: ad.note,
            status: ad.status,
            type: ad.type,
            startDate: ad.startDate.toISOString(),
            endDate: ad.endDate.toISOString(),
            createdAt: ad.createdAt.toISOString(),
          }
        })

        return {
          code: 200,
          message: "successfully",
          data: result
        }
      } else {
        return {
          code: 400,
          message: "Không có quảng cáo",
          data: null
        }
      }

    } else {
      return {
        code: 400,
        message: "Bạn không có quyền thực hiện chức năng này vui lòng đăng nhập và thử lại",
        data: null
      }
    }
  } catch (error) {
    console.log(error)
    return {
      code: 500,
      message: "Lỗi server vui lòng thử lại",
      data: null
    }
  }
}