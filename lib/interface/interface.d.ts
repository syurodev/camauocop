type IProducts = {
  _id: string;
  productName: string;
  productImages: string[];
  productPrice: number;
};

type IProductsResponse = {
  products: IProducts[] | [];
  totalPages?: number;
};

type IAddProductTypes = {
  _id: string;
  name: string;
  userId?: string;
};

type PopupProps = {
  children: React.ReactElement;
  content: React.ReactElement;
  trigger?: "mouseenter focus" | "focus" | "click";
  [key: string]: any;
};

type IProductDetail = {
  _id: string;
  productName: string;
  productDescription: {
    time: number;
    blocks: any[];
    version: string;
  };
  retail: boolean;
  packageOptions: {
    unit: string;
    weight: number;
    price: number;
  }[];
  productPrice: number;
  productSold: number;
  productQuantity: number;
  productImages: string[];
  productCreatedAt: Date;
  productDeletedAt?: Date;
  shopName: string;
  shopId: string;
  shopInfo: {
    delivery: string[]
    shop_id: {
      GHN?: number;
      GHTK?: string | number;
    };
    address: [{
      province: string;
      district: string;
      ward: string;
      apartment: string;
      GHN_district_id?: number;
      GHN_ward_code?: string;
    }];
  }
  sellerName: string;
  sellerId: string;
  sellerAvatar: string;
  productTypeName: string;
  productTypeId: string;
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

type ProductPack = {
  unit: WeightUnit;
  weight: number;
  price: number;
}