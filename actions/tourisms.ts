"use server"

import Destination, { IDestination } from "@/lib/models/destination"
import { connectToDB, verifyJwtToken } from "@/lib/utils";

export const addDestination = async (accessToken: string, data: IDestination) => {
  try {
    const token = verifyJwtToken(accessToken)

    if (!!token) {
      await connectToDB()
      const newData = new Destination(data)
      const destination = await newData.save()

      if (destination) {
        const result = {
          _id: destination._id.toString(),
          name: destination.name,
          images: destination.images,
          description: destination.description,
        }

        return {
          code: 200,
          message: "Thêm địa điểm thành công",
          data: result
        }
      } else {
        return {
          code: 400,
          message: "Lưu địa điểm không thành công vui lòng thử lại",
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
    console.log(error);
    return {
      code: 500,
      message: "Lỗi server vui lòng thử lại",
      data: null
    }
  }
}

export const getDestinations = async () => {
  try {
    const destinations = await Destination.find()

    if (destinations.length > 0) {
      const result: DestinationData[] = destinations.map(destination => (
        {
          _id: destination._id.toString(),
          name: destination.name,
          images: destination.images,
          description: destination.description,
        }
      ))

      return {
        code: 200,
        message: "successfully",
        data: result
      }
    } else {
      return {
        code: 400,
        message: "Không có dữ liệu điểm đến",
        data: null
      }
    }

  } catch (error) {
    console.log(error);
    return {
      code: 500,
      message: "Lỗi máy chủ vui lòng thử lại",
      data: null
    }
  }
}