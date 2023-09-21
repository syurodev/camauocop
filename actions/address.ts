"use server";

export const getCurrentLocation = async ({
  latitude,
  longitude,
}: {
  latitude: string;
  longitude: string;
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
      province: data.address.city,
      district: data.address.district,
      ward: data.address.suburb,
    };

    return res;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin địa chỉ:", error);
    return null;
  }
};

export const getGHNLocationCode = async (): Promise<GHNApiProvinceResponse> => {
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
};
