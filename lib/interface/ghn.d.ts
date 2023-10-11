type ProvinceGHNData = {
  ProvinceID: number;
  ProvinceName: string;
  CountryID: number;
  Code: string;
  NameExtension: NameExtension;
  IsEnable: number;
  RegionID: number;
  RegionCPN: number;
  UpdatedBy: number;
  CreatedAt: string;
  UpdatedAt: string;
  CanUpdateCOD: boolean;
  Status: number;
  UpdatedIP: string;
  UpdatedEmployee: number;
  UpdatedSource: string;
  UpdatedDate: string;
};

type GHNApiProvinceResponse = {
  code: number;
  message: string;
  data: ProvinceGHNData[];
};

interface DistrictGHNData {
  DistrictID: number;
  ProvinceID: number;
  DistrictName: string;
  Code: string;
  Type?: number;
  SupportType?: number;
  NameExtension: string[];
  IsEnable?: number;
  UpdatedBy?: number;
  CreatedAt?: string;
  UpdatedAt?: string;
  CanUpdateCOD?: boolean;
  Status?: number;
  PickType?: number;
  DeliverType?: number;
  WhiteListClient?: {
    From: number[] | null;
    To: number[] | null;
    Return: number[] | null;
  };
  WhiteListDistrict?: {
    From: any[];
    To: any[];
  };
  ReasonCode?: string;
  ReasonMessage?: string;
  OnDates?: any[] | null;
  UpdatedEmployee?: number;
  UpdatedDate?: string;
}

interface GHNApiDistrictResponse {
  code: number;
  message: string;
  data: DistrictGHNData[];
}

interface WardGHNData {
  WardCode: string;
  DistrictID: number;
  WardName: string;
  NameExtension: string[];
  IsEnable: number;
  CanUpdateCOD: boolean;
  UpdatedBy: number;
  CreatedAt: string;
  UpdatedAt: string;
  SupportType: number;
  PickType: number;
  DeliverType: number;
  WhiteListClient: {
    From: null | string;
    To: null | string;
    Return: null | string;
  };
  WhiteListWard: {
    From: null | string;
    To: null | string;
  };
  Status: number;
  ReasonCode: string;
  ReasonMessage: string;
  OnDates: null | string;
}

interface GHNApiWardResponse {
  code: number;
  message: string;
  data: WardGHNData[];
}

type GHNApiServiceFee = {
  code: number;
  message: string;
  data: {
    total: number;
    service_fee: number;
    insurance_fee: number;
    pick_station_fee: number;
    coupon_value: number;
    r2s_fee: number;
    document_return: number;
    double_check: number;
    cod_fee: number;
    pick_remote_areas_fee: number;
    deliver_remote_areas_fee: number;
    cod_failed_fee: number;
  } | null;
};


type GHNCode = {
  provinceId: number
  districtId: number
  wardCode: string
}
type GHNCodeResponse = {
  code: number
  message: string
  data: GHNCode | null
}

interface GHNOrderData {
  order_code: string;
  sort_code: string;
  trans_type: string;
  ward_encode: string;
  district_encode: string;
  fee: {
    main_service: number;
    insurance: number;
    station_do: number;
    station_pu: number;
    return: number;
    r2s: number;
    coupon: number;
    cod_failed_fee: number;
  };
  total_fee: string;
  expected_delivery_time: string;
}

interface GHNOrderDataResponse {
  code: number;
  message: string;
  data: GHNOrderData | null;
  code_message_value?: string;
}
