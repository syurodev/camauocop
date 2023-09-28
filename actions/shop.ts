"use server"

import _ from 'lodash';

import { connectToDB } from "@/lib/utils";
import { IUserRegisterShopZodSchema } from "@/lib/zodSchema/shop";
import User, { IUser } from "@/lib/models/users";
import Shop from "@/lib/models/shop";

type IProps = {
  data: IUserRegisterShopZodSchema,
  district_id: number,
  ward_code: string,
  next?: boolean
}

export const shopRegister = async ({ data, district_id, ward_code, next = false }: IProps) => {
  try {
    await connectToDB();
    console.log(next)
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
        shop_id: [{
          GHN: shopCreatedGHN.data.shop_id,
        }],
        address: [{
          province: data.province,
          district: data.district,
          ward: data.ward,
          apartment: data.apartment,
        }],
        name: data.name,
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