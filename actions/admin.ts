"use server"

import Fee, { IFee } from "@/lib/models/fee"
import Shop, { IShop } from "@/lib/models/shop"
import User from "@/lib/models/users"
import { connectToDB, verifyJwtToken } from "@/lib/utils"

export type ShopSettingData = {
  fee: number;
  status: ShopStatus;
  type: ShopType;
  tax: string;
}

export const getShops = async (accessToken: string) => {
  try {
    const token = verifyJwtToken(accessToken)

    if (!!token) {
      await connectToDB()

      const shops = await Shop.find()
        .sort({ createdAt: -1 })
        .populate({
          path: "auth",
          select: "_id username email"
        })
        .select("_id name status image address fee type")

      if (shops.length > 0) {
        const formatShops: IShopsResponse[] = shops.map(item => {
          return {
            _id: item._id.toString(),
            name: item.name,
            status: item.status,
            address: `${item.address[0].ward}, ${item.address[0].district}`,
            authId: item.auth._id.toString(),
            username: item.auth.username || item.auth.email,
            image: item.image,
            fee: item.fee,
            type: item.type
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

export const getShopSettingData = async (shopId: string, accessToken: string) => {
  try {
    const token = verifyJwtToken(accessToken);

    if (!!token) {
      const shopData: IShop | null = await Shop.findById(shopId);

      if (shopData) {
        const result: ShopSettingData = {
          fee: shopData.fee,
          status: shopData.status,
          type: shopData.type,
          tax: shopData.tax || ""
        }

        return {
          code: 200,
          message: "successfully",
          data: result
        }
      } else {
        return {
          code: 400,
          message: "Không tìm thấy cửa hàng",
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
      message: "Lỗi hệ thống vui lòng thử lại",
      data: null
    }
  }
}

export const updateShopSetting = async (shopId: string, accessToken: string, data: ShopSettingData) => {
  try {

    const token = verifyJwtToken(accessToken);

    if (!!token) {
      const shopData: IShop | null = await Shop.findById(shopId);

      if (shopData) {
        const shop = await Shop.findByIdAndUpdate(shopId, {
          fee: data.fee,
          status: data.status,
          type: data.type,
          tax: data.tax
        })

        if (shop) {
          return {
            code: 200,
            message: "Thay đổi cài đặt cửa hàng thành công",
          }
        } else {
          return {
            code: 400,
            message: "Thay đổi cài đặt cửa hàng thất bại, vui lòng thử lại",
          }
        }
      } else {
        return {
          code: 400,
          message: "Không tìm thấy cửa hàng",
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
      message: "Lỗi hệ thống vui lòng thử lại",
    }
  }
}