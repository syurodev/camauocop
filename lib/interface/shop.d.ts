type IShopInfo = {
  _id: string;
  name: string;
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
    username: string;
    email: string;
    phone: string;
    avatar: string;
    _id: string;
  };
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