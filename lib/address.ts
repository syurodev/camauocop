export const findProvince = (a: string, b: GHNApiProvinceResponse) => {
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

export const findDistrict = (a: string, b: GHNApiDistrictResponse) => {
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

export const findWard = (a: string, b: GHNApiWardResponse) => {
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