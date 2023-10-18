"use server";

export const getCurrentLocation = async ({
  latitude,
  longitude,
  serviceName,
}: {
  latitude: number;
  longitude: number;
  serviceName?: string;
}): Promise<IGeolocation | null> => {
  try {
    // Sử dụng API Nominatim của OpenStreetMap
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
    );

    if (response.ok) {
      const data = await response.json();

      const res: IGeolocation = {
        code: 200,
        display_name: data.display_name,
        province: null,
        district: null,
        ward: null,
        serviceName: null
      };

      const provinces: GHNApiProvinceResponse = await getGHNProvince()
      res.provinces = provinces
      res.province = findProvince(data.address.city || data.address.state, provinces)

      if (res.province) {
        const districts: GHNApiDistrictResponse = await getGHNDistrict(res.province?.ProvinceID)
        res.districts = districts
        res.district = findDistrict(data.address.district || data.address.county, districts)
      }

      if (res.district) {
        const wards: GHNApiWardResponse = await getGHNWard(res.district?.DistrictID)
        res.wards = wards
        res.ward = findWard(data.address.suburb || data.address.village || data.address.quarter, wards)
      }

      return res;
    } else {
      return {
        code: 500,
        message: "Có lỗi trong quá trình tự động định vị. Vui lòng chọn thủ công"
      }
    }
  } catch (error) {
    console.error("Lỗi khi lấy thông tin địa chỉ:", error);
    return {
      code: 500,
      message: "Có lỗi trong quá trình tự động định vị. Vui lòng chọn thủ công"
    };
  }
};

export const getGHNProvince = async (): Promise<GHNApiProvinceResponse> => {
  try {
    const res = await fetch(
      `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: process.env.GHN_TOKEN as string,
        },
      }
    );
    const data: GHNApiProvinceResponse = await res.json();
    return data;
  } catch (error) {
    console.log(error)
    return {
      code: 500,
      message: "Lỗi khi lấy thông tin địa chỉ. Vui lòng tải lại trang",
      data: []
    }
  }
};

export const getGHNDistrict = async (id: number): Promise<GHNApiDistrictResponse> => {
  try {
    const res = await fetch(
      `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: process.env.GHN_TOKEN as string,
        },
        body: JSON.stringify({
          "province_id": id
        })
      }
    );
    const data: GHNApiDistrictResponse = await res.json();
    return data;
  } catch (error) {
    console.log(error)
    return {
      code: 500,
      message: "Lỗi truy vấn",
      data: []
    }
  }

}

export const getGHNWard = async (id: number): Promise<GHNApiWardResponse> => {
  try {
    const res = await fetch(
      `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: process.env.GHN_TOKEN as string,
        },
        body: JSON.stringify({
          "district_id": id
        })
      }
    );
    const data: GHNApiWardResponse = await res.json();
    return data;
  } catch (error) {
    console.log(error)
    return {
      code: 500,
      message: "Lỗi khi lấy thông tin địa chỉ. Vui lòng tải lại trang",
      data: []
    }
  }

}

const findProvince = (a: string, b: GHNApiProvinceResponse) => {
  if (b && b.data) {
    const foundProvince = b.data.find((item) =>
      item.NameExtension && item.NameExtension.some((extension: string) => extension.toLowerCase() === a.toLowerCase())
    );
    if (foundProvince) {
      return foundProvince
    } else {
      return null
    }
  } else {
    return null
  }
}

const findDistrict = (a: string, b: GHNApiDistrictResponse) => {
  if (b && b.data) {
    const foundDistrict = b.data.find((item) =>
      item.NameExtension && item.NameExtension.some((extension: string) => extension.toLowerCase() === a.toLowerCase())
    );
    if (foundDistrict) {
      return foundDistrict
    } else {
      return null
    }
  } else {
    return null
  }
}

const findWard = (a: string, b: GHNApiWardResponse) => {
  if (b && b.data) {
    const foundWard = b.data.find((item) =>
      item.NameExtension && item.NameExtension.some((extension: string) => extension.toLowerCase() === a.toLowerCase())
    );
    if (foundWard) {
      return foundWard
    } else {
      return null
    }
  } else {
    return null
  }
}

export const getGHNCode = async (province: string, district: string, ward: string): Promise<GHNCodeResponse> => {
  try {
    const provinceData = await getGHNProvince()

    if (provinceData.code === 200) {
      const foundProvince = findProvince(province, provinceData)

      if (foundProvince) {
        const districtData = await getGHNDistrict(foundProvince.ProvinceID)

        if (districtData.code === 200) {
          const foundDistrict = findDistrict(district, districtData)

          if (foundDistrict) {
            const wardData = await getGHNWard(foundDistrict.DistrictID)

            if (wardData.code === 200) {
              const foundWard = findWard(ward, wardData)

              if (foundWard) {
                const data = {
                  provinceId: foundProvince.ProvinceID,
                  districtId: foundDistrict.DistrictID,
                  wardCode: foundWard.WardCode
                }

                return {
                  code: 200,
                  message: "successfully",
                  data: data
                }
              } else {
                return {
                  code: 400,
                  message: "Không tìm thấy phường/xã",
                  data: null
                }
              }
            } else {
              return {
                code: 400,
                message: "Lỗi lấy dữ liệu từ Giao Hàng Nhanh",
                data: null
              }
            }
          } else {
            return {
              code: 400,
              message: "Không tìm thấy quận/huyện",
              data: null
            }
          }
        } else {
          return {
            code: 400,
            message: "Lỗi lấy dữ liệu từ Giao Hàng Nhanh",
            data: null
          }
        }
      } else {
        return {
          code: 400,
          message: "Không tìm thấy tỉnh/thành phố",
          data: null
        }
      }
    } else {
      return {
        code: 400,
        message: "Lỗi lấy dữ liệu từ Giao Hàng Nhanh",
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