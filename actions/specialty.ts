"use server"

import Product from "@/lib/models/products"
import Specialty, { ISpecialty } from "@/lib/models/specialty"
import { connectToDB, verifyJwtToken } from "@/lib/utils"

export const getSpecialtys = async () => {
  try {
    await connectToDB()
    const specialtys: ISpecialty[] = await Specialty.find()

    if (specialtys && specialtys.length > 0) {
      const productCounts = await Product.aggregate([
        {
          $group: {
            _id: "$specialtyId",
            count: { $sum: 1 },
          },
        },
      ]);

      // Tạo một đối tượng Map để lưu trữ số lượng tour cho từng loại transportation
      const productCountMap = new Map<string, number>();
      productCounts.forEach((item: { _id: string; count: number }) => {
        productCountMap.set(item._id, item.count);
      });

      const specialtysWithCount: SpecialtysData[] = specialtys.map((specialty: ISpecialty) => {
        const count = productCountMap.get(specialty._id) || 0;
        return {
          _id: specialty._id.toString(),
          name: specialty.name,
          images: specialty.images,
          productCount: count || 0,
        };
      });

      return {
        code: 200,
        message: "successfully",
        data: specialtysWithCount
      }
    } else {
      return {
        code: 404,
        message: "Không tìm thấy đặc sản",
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

export const addSpecialty = async (accessToken: string, data: ISpecialty) => {
  try {
    const token = verifyJwtToken(accessToken)

    if (!!token) {
      await connectToDB()

      const exitting = await Specialty.findOne({ name: { $regex: data.name, $options: "i" } })

      if (exitting) {
        return {
          code: 400,
          message: "Đặc sản đã tồn tại",
          data: null
        }
      } else {
        const newData = new Specialty(data)
        const specialty = await newData.save()

        if (specialty) {
          const result: SpecialtysData = {
            _id: specialty._id.toString(),
            name: specialty.name,
            images: specialty.images,
            productCount: 0
          }

          return {
            code: 200,
            message: "Thêm đặc sản thành công",
            data: result
          }
        } else {
          return {
            code: 400,
            message: "Lưu đặc sản không thành công vui lòng thử lại",
            data: null
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
    console.log(error);
    return {
      code: 500,
      message: "Lỗi server vui lòng thử lại",
      data: null
    }
  }
}

export const getSpecialtysDetail = async () => {
  try {
    await connectToDB()
    const specialtys: ISpecialty[] = await Specialty.find()

    if (specialtys && specialtys.length > 0) {
      const productCounts = await Product.aggregate([
        {
          $group: {
            _id: "$specialtyId",
            count: { $sum: 1 },
          },
        },
      ]);

      // Tạo một đối tượng Map để lưu trữ số lượng tour cho từng loại transportation
      const productCountMap = new Map<string, number>();
      productCounts.forEach((item: { _id: string; count: number }) => {
        productCountMap.set(item._id, item.count);
      });

      const specialtysWithCount: SpecialtysDetail[] = specialtys.map((specialty: ISpecialty) => {
        const count = productCountMap.get(specialty._id) || 0;
        return {
          _id: specialty._id.toString(),
          name: specialty.name,
          images: specialty.images,
          description: specialty.description,
          productCount: count || 0,
        };
      });

      return {
        code: 200,
        message: "successfully",
        data: specialtysWithCount
      }
    } else {
      return {
        code: 404,
        message: "Không tìm thấy đặc sản",
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