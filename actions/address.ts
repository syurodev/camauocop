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

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const res: IGeolocation = {
      display_name: data.display_name,
      province: null,
      district: null,
      ward: null,
      serviceName: null
    };

    const provinces: GHNApiProvinceResponse = await getGHNProvince()
    res.provinces = provinces
    res.province = findProvince(data.address.city, provinces)

    if (res.province) {
      const districts: GHNApiDistrictResponse = await getGHNDistrict(res.province?.ProvinceID)
      res.districts = districts
      res.district = findDistrict(data.address.district, districts)
    }

    if (res.district) {
      const wards: GHNApiWardResponse = await getGHNWard(res.district?.DistrictID)
      res.wards = wards
      res.ward = findWard(data.address.suburb, wards)
    }

    return res;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin địa chỉ:", error);
    return null;
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
      message: "Lỗi truy vấn",
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
      message: "Lỗi truy vấn",
      data: []
    }
  }

}

const findProvince = (a: string, b: GHNApiProvinceResponse) => {
  const foundProvince = b.data.find((item) =>
    item.NameExtension.some((extension: string) => extension.toLowerCase() === a.toLowerCase())
  );
  if (foundProvince) {
    return foundProvince
  } else {
    return null
  }
}

const findDistrict = (a: string, b: GHNApiDistrictResponse) => {
  const foundDistrict = b.data.find((item) =>
    item.NameExtension.some((extension: string) => extension.toLowerCase() === a.toLowerCase())
  );
  if (foundDistrict) {
    return foundDistrict
  } else {
    return null
  }
}

const findWard = (a: string, b: GHNApiWardResponse) => {
  const foundWard = b.data.find((item) =>
    item.NameExtension.some((extension: string) => extension.toLowerCase() === a.toLowerCase())
  );
  if (foundWard) {
    return foundWard
  } else {
    return null
  }
}