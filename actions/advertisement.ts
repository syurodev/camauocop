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

export const getAdvertisement = async ({
  shopId,
  type,
  status
}: {
  shopId?: string
  type?: AdvertisementType
  status?: AdvertisementStatus
}) => {
  try {
    await connectToDB()

    let query: any = {}

    if (shopId) {
      query = { ...query, shopId: shopId }
    }

    if (type) {
      query = { ...query, type: type }
    }

    if (status) {
      query = { ...query, status: status }
    }

    const ads: IAdvertisement[] = await Advertisement.find(query)

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
  } catch (error) {
    console.log(error)
    return {
      code: 500,
      message: "Lỗi server vui lòng thử lại",
      data: null
    }
  }
}

export const changeAdvertisementStatus = async (accessToken: string, status: AdvertisementStatus, note: string, id: string) => {
  try {
    const token = verifyJwtToken(accessToken)
    if (!!token) {
      await connectToDB()

      const ads: IAdvertisement | null = await Advertisement.findByIdAndUpdate({ _id: id }, { status: status, note: note })

      if (ads) {
        return {
          code: 200,
          message: "successfully",
        }
      } else {
        return {
          code: 400,
          message: "Cập nhật không thành công vui lòng thử lại",
        }
      }

    } else {
      return {
        code: 400,
        message: "Bạn không có quyền thực hiện chức năng này vui lòng đăng nhập và thử lại",
      }
    }
  } catch (error) {
    console.log(error)
    return {
      code: 500,
      message: "Lỗi server vui lòng thử lại",
    }
  }
}