"use server"

import Destination, { IDestination } from "@/lib/models/destination"
import Tourism from "@/lib/models/tourisms";
import Transportation, { ITransportation } from "@/lib/models/transportation";
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

export const getTransportation = async () => {
  try {
    // Lấy danh sách tất cả transportation
    const allTransportation: ITransportation[] = await Transportation.find();

    // Đếm số tour đang sử dụng mỗi loại transportation
    const transportationCounts = await Tourism.aggregate([
      {
        $group: {
          _id: "$transportation",
          count: { $sum: 1 },
        },
      },
    ]);

    // Tạo một đối tượng Map để lưu trữ số lượng tour cho từng loại transportation
    const transportationCountMap = new Map<string, number>();
    transportationCounts.forEach((item: { _id: string; count: number }) => {
      transportationCountMap.set(item._id, item.count);
    });

    // Kết hợp thông tin transportation và số lượng tour
    const transportationWithCount: TransportationData[] = allTransportation.map((transport: ITransportation) => {
      const count = transportationCountMap.get(transport._id) || 0;
      return {
        _id: transport._id.toString(),
        name: transport.name,
        tourCount: count,
      };
    });

    return {
      code: 200,
      message: "Lấy danh sách transportation thành công",
      data: transportationWithCount,
    };
  } catch (error) {
    console.log(error)
    return {
      code: 500,
      message: "Lỗi hệ thống vui lòng thử lại",
      data: null
    }
  }
}

export const addTransportation = async (accessToken: string, name: string) => {
  try {
    const token = verifyJwtToken(accessToken)

    if (!!token) {
      const exitting = await Transportation.findOne({ name: { $regex: name, $options: "i" } })

      if (exitting) {
        return {
          code: 400,
          message: "Phương tiện đã tồn tại",
          data: null
        }
      } else {
        const newTransportsation = new Transportation(name)

        const result = await newTransportsation.save()

        return {
          code: 200,
          message: "Thêm phương tiện thành công",
          data: {
            _id: result._id.toString(),
            name: result.name
          }
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
      message: "Lỗi hệ thống vui lòng thử lại",
      data: null
    }
  }
}