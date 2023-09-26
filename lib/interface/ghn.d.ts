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