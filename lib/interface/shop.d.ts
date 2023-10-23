type IShopInfo = {
  _id: string;
  name: string;
  image: string;
  phone: string;
  address: [{
    province: string;
    district: string;
    ward: string;
    apartment: string;
    GHN_district_id?: number;
    GHN_ward_code?: string;
  }];
  delivery: string[];
  auth: {
    avatar: string;
    _id: string;
  };
  staffs: {
    avatar: string;
    _id: string;
  }[];
  totalRevenue: number;
  totalOrders: number;
}

type ShopInfoResponse = {
  code: number;
  message: string;
  data?: IShopInfo
};

type TopSellingProduct = {
  productId: string;
  productName: string;
  weightSold: number;
};

type TopSellingProductResponse = {
  code: number;
  message: string;
  data: TopSellingProduct[] | null
}

type MonthlySale = {
  [month: number]: number;
};

type MonthlySales = {
  month: number;
  totalAmount: number
};

type MonthlySalesResponse = {
  code: number;
  message: string;
  data: MonthlySales[] | null
}

type IShopsResponse = {
  _id: string
  name: string
  status: ShopStatus,
  address: string
  authId: string,
  username: string,
  fee: number,
  type: ShopType,
  image: string
  [key: string]: any;
}

type ShopStatus = "active" | "block"
type ShopType = "personal" | "enterprise"
type StaffStatus = "pending" | "working" | "stopWorking"

type MonthlyRevenue = {
  [month: number]: number;
};