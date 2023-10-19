"use server"

import Fee, { IFee } from "@/lib/models/fee"
import Shop from "@/lib/models/shop"
import User from "@/lib/models/users"
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

export const getRevenueForLast5Months = async (accessToken: string) => {
  try {
    await connectToDB()
    const token = await verifyJwtToken(accessToken)

    if (!!token) {
      const currentDate = new Date();
      const fiveMonthsAgo = new Date(currentDate);
      fiveMonthsAgo.setMonth(currentDate.getMonth() - 4);

      const revenue: IFee[] = await Fee.find({
        createdAt: {
          $gte: fiveMonthsAgo,
          $lte: currentDate
        },
        status: "collected",
      }).exec();

      if (revenue.length > 0) {
        const monthlyRevenue: MonthlyRevenue = {};
        for (const fee of revenue) {
          const month = fee.createdAt.getMonth() + 1;

          const totalAmount = fee.feeAmount;

          if (!monthlyRevenue[month]) {
            monthlyRevenue[month] = 0;
          }
          monthlyRevenue[month] += totalAmount;
        }

        const result = transformMonthlySales(monthlyRevenue)

        return {
          code: 200,
          message: "successfully",
          data: result
        }
      } else {
        return {
          code: 404,
          messgae: "Không có thông tin doanh thu",
        }
      }
    } else {
      return {
        code: 400,
        message: "Không được phép thực hiện chức năng này, vui lòng đăng nhập và thử lại",
        data: null
      }
    }
  } catch (error) {
    console.log(error)
    return {
      code: 500,
      message: "Lỗi hệ thống, vui lòng thử lại",
      data: null
    }
  }
}

function transformMonthlySales(monthlyRevenue: MonthlyRevenue) {
  const transformedSales = Object.entries(monthlyRevenue).map(([month, totalAmount]) => ({
    month: parseInt(month, 10),
    totalAmount,
  }));

  return transformedSales;
}

export const countUsersByLast5Months = async (accessToken: string) => {
  try {
    const token = verifyJwtToken(accessToken);

    if (!!token) {
      const currentDate = new Date();
      const last5Months = new Date(currentDate);
      last5Months.setMonth(currentDate.getMonth() - 4);

      const result = await User.aggregate([
        {
          $match: {
            createdAt: { $gte: last5Months },
          },
        },
        {
          $project: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' },
          },
        },
        {
          $group: {
            _id: { month: '$month', year: '$year' },
            count: { $sum: 1 },
          },
        },
      ]);

      const formattedResult: { [month: number]: number } = {};
      result.forEach((item) => {
        const { month, count } = item._id;
        formattedResult[month] = count;
      });

      return {
        code: 200,
        message: "successfully",
        data: formattedResult
      };
    } else {
      return {
        code: 400,
        message: "Không được phép thực hiện chức năng này, vui lòng đăng nhập và thử lại",
        data: null
      }
    }
  } catch (error) {
    console.error(error);
    return {
      code: 500,
      message: "Lỗi hệ thống, vui lòng thử lại",
      data: null
    }
  }
};