"use server"

type IGetGHNServiceFeeProps = {
  shop_id: number,
  to_ward_code: string,
  to_district_id: number,
  items: {
    name: string,
    quantity: number,
    weight: number,
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