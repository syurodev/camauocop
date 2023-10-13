"use server"

import { IDeliveryOrderSchema } from "@/lib/zodSchema/order";

type IGetGHNServiceFeeProps = {
  shop_id: number,
  to_ward_code: string,
  to_district_id: number,
  items: {
    name: string,
    quantity: number,
    weight: number,
    length: number;
    width: number;
    height: number;
  }[],
  weight: number
}

export const getGHNServiceFee = async ({
  shop_id,
  to_ward_code,
  to_district_id,
  items,
  weight
}: IGetGHNServiceFeeProps): Promise<GHNApiServiceFee> => {
  try {
    if (items.length > 0) {
      const res = await fetch("https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: process.env.GHN_TOKEN as string,
          shop_id: shop_id.toString()
        },
        body: JSON.stringify({
          "to_ward_code": to_ward_code,
          "to_district_id": to_district_id,
          "items": items,
          "weight": weight,
          "service_type_id": 2
        })
      }
      );

      const data: GHNApiServiceFee = await res.json()
      return data
    } else {
      return {
        code: 400,
        message: "Không có thông tin hàng hoá",
        data: null
      }
    }
  } catch (error) {
    console.log(error)
    return {
      code: 400,
      message: "Lỗi lấy phí dịch vụ",
      data: null
    }
  }

}

export const GHNCreateOrder = async (data: IDeliveryOrderSchema, shop_id: number): Promise<GHNOrderDataResponse> => {
  try {
    const res = await fetch("https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: process.env.GHN_TOKEN as string,
        shop_id: shop_id.toString()
      },
      body: JSON.stringify(data)
    })

    const dataGHN: GHNOrderDataResponse = await res.json()

    if (dataGHN.code === 200) {
      return dataGHN
    } else {
      return {
        code: 400,
        message: dataGHN.code_message_value!,
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