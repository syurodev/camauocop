"use server"

import { Types } from 'mongoose';

import Destination, { IDestination } from "@/lib/models/destination"
import TourType, { ITourType } from "@/lib/models/tourType";
import Tourism from "@/lib/models/tourisms";
import Transportation, { ITransportation } from "@/lib/models/transportation";
import { connectToDB, verifyJwtToken } from "@/lib/utils";
import { ITourSchema } from "@/lib/zodSchema/tourSchema";

const isValidObjectId = (slug: string): boolean => {
  return Types.ObjectId.isValid(slug) && slug.length === 24;
};

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
          tourCount: 0
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

export const getDestinations = async (_id?: string) => {
  try {
    await connectToDB()
    let query: any = {}

    if (_id) {
      query = { _id: _id }
    }

    const destinations: IDestination[] = await Destination.find(query)

    if (destinations.length > 0) {
      const destinationCounts = await Tourism.aggregate([
        {
          $group: {
            _id: { $toString: "$destination" },
            count: { $sum: 1 },
          },
        },
      ]);

      // Tạo một đối tượng Map để lưu trữ số lượng tour cho từng loại transportation
      const destinationsCountMap = new Map<string, number>();
      destinationCounts.forEach((item: { _id: string; count: number }) => {
        destinationsCountMap.set(item._id, item.count);
      });

      // Kết hợp thông tin transportation và số lượng tour
      const destinationsWithCount: DestinationData[] = destinations.map((destination: IDestination) => {
        const count = destinationsCountMap.get(destination._id.toString()) || 0;
        return {
          _id: destination._id.toString(),
          name: destination.name,
          images: destination.images,
          description: destination.description,
          tourCount: count,
        };
      });

      return {
        code: 200,
        message: "successfully",
        data: JSON.stringify(destinationsWithCount)
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

export const getTransportation = async (_id?: string) => {
  try {
    await connectToDB()

    let query: any = {}

    if (_id) {
      query = { _id: _id }
    }
    // Lấy danh sách tất cả transportation
    const allTransportation: ITransportation[] = await Transportation.find(query);

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

export const addTransportation = async (accessToken: string, data: ITransportation) => {
  try {
    const token = verifyJwtToken(accessToken)

    if (!!token) {
      const exitting = await Transportation.findOne({ name: { $regex: data.name, $options: "i" } })

      if (exitting) {
        return {
          code: 400,
          message: "Phương tiện đã tồn tại",
          data: null
        }
      } else {
        const newTransportsation = new Transportation(data)

        const res = await newTransportsation.save()

        const result: TransportationData = {
          _id: res._id.toString(),
          name: res.name,
          tourCount: 0
        }

        return {
          code: 200,
          message: "Thêm phương tiện thành công",
          data: result
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

export const addTourType = async (accessToken: string, data: ITourType) => {
  try {
    const token = verifyJwtToken(accessToken)

    if (!!token) {
      const exitting = await TourType.findOne({ name: { $regex: data.name, $options: "i" } })

      if (exitting) {
        return {
          code: 400,
          message: "Loại tour tồn tại",
          data: null
        }
      } else {
        const newTourType = new TourType(data)

        const res = await newTourType.save()

        const result: TourTypeData = {
          _id: res._id.toString(),
          name: res.name,
          tourCount: 0
        }

        return {
          code: 200,
          message: "Thêm phương tiện thành công",
          data: result
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

export const getTourType = async () => {
  try {
    await connectToDB()
    const allTourType: ITourType[] = await TourType.find();

    const transportationCounts = await Tourism.aggregate([
      {
        $group: {
          _id: "$tourType",
          count: { $sum: 1 },
        },
      },
    ]);

    const transportationCountMap = new Map<string, number>();
    transportationCounts.forEach((item: { _id: string; count: number }) => {
      transportationCountMap.set(item._id, item.count);
    });

    const transportationWithCount: TourTypeData[] = allTourType.map((type: ITourType) => {
      const count = transportationCountMap.get(type._id) || 0;
      return {
        _id: type._id.toString(),
        name: type.name,
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

export const addTourism = async (accessToken: string, data: ITourSchema) => {
  try {
    const token = verifyJwtToken(accessToken)
    if (!!token) {
      const editData = {
        ...data,
        transportation: data.transportation.split(",")
      }

      const newTour = new Tourism(editData)

      await newTour.save()

      return {
        code: 200,
        message: `Đăng ký tour ${newTour.tourName} thành công.`
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
      message: "Lỗi hệ thống vui lòng thử lại"
    }
  }
}

export const getTourisms = async ({
  userId,
  destinationId,
  status
}: {
  userId?: string,
  destinationId?: string
  status?: TourismsStatus
}) => {
  try {
    await connectToDB()
    let query: any = {}

    if (userId) {
      query = { ...query, userId: userId }
    }
    if (destinationId) {
      query = { ...query, destination: destinationId }
    }
    if (status) {
      query = { ...query, status: status }
    }

    const tourisms = await Tourism.find(query)
      .populate('tourType', "name")
      .populate('destination', "name")
      .populate('userId', "username email image")
      .populate({
        path: 'transportation',
        model: 'Transportation',
        select: "name"
      });

    if (tourisms.length > 0) {
      const result: TourData[] = tourisms.map(tourism => {
        return {
          _id: tourism._id.toString(),
          username: tourism?.userId?.username || tourism?.userId?.email || "",
          avatar: tourism?.userId?.image || "",
          status: tourism.status,
          tourName: tourism.tourName,
          destinationName: tourism.destination.name,
          duration: tourism.duration,
          price: tourism.price,
          tourTypeName: tourism.tourType.name,
          note: tourism.note || "",
        }
      })

      return {
        code: 200,
        message: "sucessfully",
        data: JSON.stringify(result)
      }
    } else {
      return {
        code: 404,
        message: "Không có tour",
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

export const changeTourStatus = async (accessToken: string, tourId: string, status: TourismsStatus, note: string) => {
  try {
    await connectToDB()
    const token = verifyJwtToken(accessToken)
    if (!!token) {
      const tour = await Tourism.findByIdAndUpdate({ _id: tourId }, { status: status, note: note })

      if (tour) {
        return {
          code: 200,
          message: "Cập nhật thành công"
        }
      } else {
        return {
          code: 400,
          message: "Cập nhật thất bại vui lòng thử lại"
        }
      }

    } else {
      return {
        code: 400,
        message: "Bạn không có quyền thực hiện chức năng này vui lòng đăng nhập và thử lại"
      }
    }
  } catch (error) {
    return {
      code: 500,
      message: "Lỗi hệ thống vui lòng thử lại"
    }
  }
}

export const getTourDetail = async (_id: string) => {
  try {
    await connectToDB()
    const tourism = await Tourism.findById(_id)
      .populate('tourType', "name")
      .populate('destination', "name")
      .populate('userId', "username email image")
      .populate({
        path: 'transportation',
        model: 'Transportation',
        select: "name"
      });

    if (tourism) {
      const result: TourDetailData = {
        _id: tourism._id.toString(),
        username: tourism?.userId?.username || tourism?.userId?.email || "",
        avatar: tourism?.userId?.image || "",
        status: tourism.status,
        tourName: tourism.tourName,
        destinationName: tourism.destination.name,
        duration: tourism.duration,
        tourContracts: tourism.tourContracts.map((item: string) => item),
        price: tourism.price,
        tourTypeName: tourism.tourType.name,
        note: tourism.note || "",
        accommodation: tourism.accommodation,
        contactInformation: tourism.contactInformation,
        destinationId: tourism.destination._id.toString(),
        exclusions: tourism.exclusions.map((item: {
          content: string;
        }) => {
          return {
            content: item.content
          }
        }),
        inclusions: tourism.inclusions.map((item: {
          content: string;
        }) => {
          return {
            content: item.content
          }
        }),
        itinerary: tourism.itinerary.map((item: {
          time: string;
          action: string;
        }) => {
          return {
            time: item.time,
            action: item.action,
          }
        }),
        numberOfPeople: tourism.numberOfPeople,
        tourTypeId: tourism.tourType._id.toString(),
        transportation: tourism.transportation.map((item: {
          _id: string;
          name: string;
        }) => {
          return {
            _id: item._id,
            name: item.name,
          }
        }),
        userid: tourism.userId._id.toString()
      }

      return {
        code: 200,
        message: "successfully",
        data: JSON.stringify(result)
      }
    } else {
      return {
        code: 404,
        message: "Không tìm thấy thông tin tour",
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

export const searchTours = async (slug: string, page: number) => {
  try {
    const limit = 20;
    const skip = (page - 1) * limit;
    let query: any = { status: 'accepted' }
    if (isValidObjectId(slug)) {
      query = { ...query, destination: slug }
    } else {
      query = { ...query, tourName: { $regex: slug, $options: 'i' } }
    }

    const totalTours = await Tourism.countDocuments(query);
    const totalPages = Math.ceil(totalTours / limit);

    const tourisms = await Tourism.find(query)
      .populate('tourType', "name")
      .populate('destination', "name images")
      .populate('userId', "username email image")
      .populate({
        path: 'transportation',
        model: 'Transportation',
        select: "name"
      })
      .limit(limit)
      .skip(skip)

    if (tourisms.length > 0) {
      const result: TourData[] = tourisms.map(tourism => {
        return {
          _id: tourism._id.toString(),
          username: tourism?.userId?.username || tourism?.userId?.email || "",
          avatar: tourism?.userId?.image || "",
          status: tourism.status,
          tourName: tourism.tourName,
          destinationName: tourism.destination.name,
          duration: tourism.duration,
          price: tourism.price,
          tourTypeName: tourism.tourType.name,
          note: tourism.note || "",
        }
      })

      return {
        code: 200,
        message: "sucessfully",
        data: JSON.stringify(result),
        totalPages: totalPages
      }
    } else {
      return {
        code: 404,
        message: "Không có tour",
        data: null,
        totalPages: 0
      }
    }
  } catch (error) {
    console.log(error);
    return {
      code: 500,
      message: "Lỗi hệ thống vui lòng thử lại",
      data: null,
      totalPages: 0,
    };
  }
}