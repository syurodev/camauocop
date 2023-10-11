type PopupProps = {
  children: React.ReactElement;
  content: React.ReactElement;
  trigger?: "mouseenter focus" | "focus" | "click";
  [key: string]: any;
};

type IGeolocation = {
  code: number;
  display_name?: string;
  province?: ProvinceGHNData | null;
  district?: DistrictGHNData | null;
  ward?: WardGHNData | null;
  provinces?: GHNApiProvinceResponse
  districts?: GHNApiDistrictResponse
  wards?: GHNApiWardResponse
  serviceName?: string | null;
  message?: string;
};

type WeightUnit = 'tấn' | 'kg' | 'gram';