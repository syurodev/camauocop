"use server"

import _ from 'lodash';

import { connectToDB, verifyJwtToken } from "@/lib/utils";
import { IUserRegisterShopZodSchema } from "@/lib/zodSchema/shop";
import User, { IUser } from "@/lib/models/users";
import Shop from "@/lib/models/shop";
import Order from '@/lib/models/orders';
import { IDeliveryOrderSchema } from '@/lib/zodSchema/order';
import { GHNCreateOrder } from './delivery';
import { revalidatePath } from 'next/cache';

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

export const approveOrder = async (token: string, id: string, data: IDeliveryOrderSchema, shop_id: number) => {
  try {
    await connectToDB()
    const verifyToken = verifyJwtToken(token)

    if (!!verifyToken) {
      const order = await Order.findById({ _id: id })

      if (order) {
        const GHNRes: GHNOrderDataResponse = await GHNCreateOrder(data, shop_id)

        console.log(GHNRes)
        if (GHNRes.code === 200) {
          console.log(GHNRes)
          order.shippingCode = GHNRes.data?.order_code
          order.orderStatus = "processed"

          await order.save();
          return {
            code: 200,
            message: "Đơn hàng đã được xử lý và cập nhật thành công.",
          };
        } else {
          return {
            code: 400,
            message: GHNRes.code_message_value || "Lỗi tạo đơn hàng với Giao Hàng Nhanh"
          }
        }
      } else {
        return {
          code: 404,
          message: "Không tìm thấy đơn hàng"
        }
      }
    } else {
      return {
        code: 400,
        message: "Không được phép thực hiện chức năng này, vui lòng đăng nhập và thử lại"
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