"use server"

import _ from 'lodash';

import { connectToDB, verifyJwtToken } from "@/lib/utils";
import { IUserRegisterShopZodSchema } from "@/lib/zodSchema/shop";
import User, { IUser } from "@/lib/models/users";
import Shop from "@/lib/models/shop";
import Order, { IOrderSchema } from '@/lib/models/orders';
import { convertWeight } from '@/lib/convertWeight';
import ProductType from '@/lib/models/productTypes';

type IProps = {
  data: IUserRegisterShopZodSchema,
  district_id: number,
  ward_code: string,
  next?: boolean
}

export const shopRegister = async ({ data, district_id, ward_code, next = false }: IProps) => {
  try {
    await connectToDB();
    const shopExisting = await Shop.findOne({ auth: data.auth })

    if (shopExisting) {
      return {
        code: 200,
        message: "Người dùng này đã có cữa hàng"
      }
    }

    const matchingUser: IUser | null = await User.findOne({ _id: data.auth });

    if (matchingUser) {
      const newAddress = {
        province: data.province,
        district: data.district,
        ward: data.ward,
        apartment: data.apartment,
      }

      if (matchingUser.address && matchingUser.address.length > 0) {
        const isUnique = matchingUser.address.every(existingAddress =>
          _.isEqual(newAddress, existingAddress)
        );

        if (isUnique) {
          matchingUser.address?.push(newAddress);
          await User.findByIdAndUpdate(data.auth, { address: matchingUser.address });
        }
      } else {
        await User.findByIdAndUpdate(data.auth, { $push: { address: newAddress } });
      }

      const matchingPhones = await User.find({
        phone: data.phone,
        _id: { $ne: data.auth },
      })

      if (matchingPhones.length > 0) {
        return {
          code: 401,
          message: "Số điện thoại đã được sử dụng"
        }
      } else {
        if (matchingUser.phone) {
          if (matchingUser.phone !== data.phone) {
            if (next) {
              await User.findByIdAndUpdate(data.auth, { $set: { phone: data.phone } });
            } else {
              return {
                code: 4011,
                message: "Bạn đang sử dụng một số điện thoại khác."
              }
            }
          }
        } else {
          await User.findByIdAndUpdate(data.auth, { $set: { phone: data.phone } });
        }
      }
    }

    const address = `${data.apartment}, ${data.ward}, ${data.district}, ${data.province}`

    const resGHN = await fetch("https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shop/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: process.env.GHN_TOKEN as string,
      },
      body: JSON.stringify({
        "name": data.name,
        "phone": data.phone,
        "district_id": district_id,
        "ward_code": ward_code.toString(),
        "address": address,
      })
    })
    const shopCreatedGHN = await resGHN.json()

    if (shopCreatedGHN.code === 200) {
      const newShop = new Shop({
        auth: data.auth,
        shop_id: {
          GHN: shopCreatedGHN.data.shop_id,
        },
        address: [{
          province: data.province,
          district: data.district,
          ward: data.ward,
          apartment: data.apartment,
          GHN_district_id: district_id,
          GHN_ward_code: ward_code
        }],
        name: data.name,
        delivery: data.delivery
      })

      await newShop.save()

      await User.findByIdAndUpdate(data.auth, { $set: { role: "shop" } });

      return {
        code: 200,
        message: "Đăng ký cửa hàng thành công"
      }
    } else {
      return {
        code: 500,
        message: "Lỗi đăng ký cửa hàng với giao hàng nhanh"
      }
    }
  } catch (error) {
    console.log(error)
    return {
      code: 500,
      message: "Lỗi hệ thống, vui lòng thử lại"
    }
  }
}

export const getShopInfo = async (id: string): Promise<ShopInfoResponse> => {
  try {
    const shop = await Shop.findById(id)
      .populate({
        path: 'auth',
        select: '_id username email phone image'
      })
      .exec();

    if (!shop) {
      return {
        code: 404,
        message: 'Shop not found',
      };
    }

    const orders = await Order.find({ shopId: id })
      .select('totalAmount orderStatus orderDate')
      .exec();

    // Tính tổng doanh thu từ các đơn hàng
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);

    // Extract relevant information from the shop
    const shopInfo: IShopInfo = {
      _id: shop._id.toString(),
      name: shop.name,
      address: shop.address,
      delivery: shop.delivery,
      auth: {
        username: shop.auth.username,
        email: shop.auth.email,
        phone: shop.auth.phone,
        avatar: shop.auth.image,
        _id: shop.auth._id.toString()
      },
      totalRevenue,
      totalOrders: orders.length,
    };
    return {
      code: 200,
      message: "successfully",
      data: shopInfo
    }
  } catch (error) {
    console.log(error)
    return {
      code: 500,
      message: "Lỗi lấy thông tin shop",
    }
  }
}

export const topProduct = async (shopId: string, accessToken: string): Promise<TopSellingProductResponse> => {
  try {
    await connectToDB()
    const token = await verifyJwtToken(accessToken)

    if (!!token) {
      const today = new Date();
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      const orders: IOrderSchema[] = await Order.find({
        shopId: shopId,
        orderDate: {
          $gte: firstDayOfMonth,
          $lte: lastDayOfMonth,
        },
        orderStatus: {
          $nin: ["pending", "canceled"],
        },
      }).exec();
      if (orders.length > 0) {

        // Tạo một mapping của _id sản phẩm đến trọng lượng đã bán
        const productSales: { [productId: string]: { productName: string, weightSold: number } } = {};

        // Lặp qua các đơn đặt hàng để tính trọng lượng sản phẩm đã bán và lấy _id sản phẩm
        orders.forEach((order) => {
          order.products.forEach((product) => {
            const productId = product.productId
            const productName = product.productSnapshot.name;
            let productWeight = 0

            if (product.unit === "kg") {
              productWeight = product.weight * product.quantity
            } else {
              productWeight = convertWeight(product.weight, product.unit as WeightUnit, "kg") * product.quantity
            }

            if (productSales[productId]) {
              productSales[productId].weightSold += productWeight
            } else {
              productSales[productId] = {
                productName,
                weightSold: productWeight,
              };
            }
          });
        });

        // Chuyển đổi mapping thành mảng
        const topSellingProducts = Object.keys(productSales).map((productId) => ({
          productId,
          ...productSales[productId],
        }));

        // Sắp xếp sản phẩm theo trọng lượng đã bán giảm dần
        topSellingProducts.sort((a, b) => b.weightSold - a.weightSold);

        // Giới hạn số lượng sản phẩm trả về thành 10
        const top10SellingProducts = topSellingProducts.slice(0, 10);

        return {
          code: 200,
          message: "successfully",
          data: top10SellingProducts
        }
      } else {
        return {
          code: 404,
          message: "Không có dữ liệu top sản phẩm bán chạy",
          data: null
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

export const getSalesForLast5Months = async (shopId: string, accessToken: string): Promise<MonthlySalesResponse> => {
  try {
    await connectToDB()
    const token = await verifyJwtToken(accessToken)

    if (!!token) {
      const currentDate = new Date();
      const fiveMonthsAgo = new Date(currentDate);
      fiveMonthsAgo.setMonth(currentDate.getMonth() - 4);

      const sales: IOrderSchema[] = await Order.find({
        shopId: shopId,
        orderDate: {
          $gte: fiveMonthsAgo,
          $lte: currentDate
        },
        orderStatus: {
          $nin: ["pending", "canceled"],
        },
      }).exec();

      if (sales.length > 0) {
        const monthlySales: MonthlySale = {};
        for (const order of sales) {
          const month = order.orderDate.getMonth() + 1;
          const totalAmount = order.totalAmount;

          if (!monthlySales[month]) {
            monthlySales[month] = 0;
          }
          monthlySales[month] += totalAmount;
        }

        const result = transformMonthlySales(monthlySales)

        return {
          code: 200,
          message: "successfully",
          data: result
        }
      } else {
        return {
          code: 404,
          message: "Không có dữ liệu doanh thu",
          data: null
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

function transformMonthlySales(monthlySales: MonthlySale) {
  const transformedSales = Object.entries(monthlySales).map(([month, totalAmount]) => ({
    month: parseInt(month, 10),
    totalAmount,
  }));

  return transformedSales;
}

export const topSellingProductTypes = async (shopId: string, accessToken: string) => {
  try {
    await connectToDB()
    const token = await verifyJwtToken(accessToken)

    if (!!token) {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;

      const startDate = new Date(currentDate.getFullYear(), currentMonth - 1, 1);
      const endDate = new Date(currentDate.getFullYear(), currentMonth, 0);

      const orders: IOrderSchema[] = await Order.find({
        shopId: shopId,
        orderDate: {
          $gte: startDate,
          $lte: endDate
        },
        orderStatus: {
          $nin: ["pending", "canceled"],
        },
      }).exec();

      if (orders.length > 0) {
        const productTypeSales: Record<string, number> = {};

        orders.forEach((order) => {
          order.products.forEach((product) => {
            const productType = product.productSnapshot.productType;
            if (!productTypeSales[productType]) {
              productTypeSales[productType] = 0;
            }

            if (product.unit === "kg") {
              productTypeSales[productType] += product.weight * product.quantity;
            } else {
              productTypeSales[productType] += convertWeight(product.weight, product.unit as WeightUnit, "kg") * product.quantity;
            }
          });
        });

        const sortedProductTypes = Object.keys(productTypeSales).sort(
          (a, b) => productTypeSales[b] - productTypeSales[a]
        );

        const result = await Promise.all(
          sortedProductTypes.map(async (productTypeId) => {
            const productType = await ProductType.findById(productTypeId).exec();
            return {
              name: productType ? productType.name : 'Unknown',
              sold: productTypeSales[productTypeId],
            };
          })
        );

        return {
          code: 200,
          message: "successfully",
          data: result
        }
      } else {
        return {
          code: 404,
          message: "Không có dữ liệu top loại sản phẩm bán chạy",
          data: null
        }
      }
    } else {
      return {
        code: 401,
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