type IProducts = {
  _id: string;
  productName: string;
  productTypeName: string;
  sellerName: string;
  sellerAvatar: string;
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
  productPrice: number;
  productSold: number;
  productQuantity: number;
  productImages: string[];
  productCreatedAt: Date;
  productDeletedAt?: Date;
  productAuction: boolean;
  sellerName: string;
  sellerId: string;
  sellerAvatar: string;
  productTypeName: string;
  productTypeId: string;
};

type IGeolocation = {
  display_name: string;
  province: string;
  district: string;
  ward: string;
};

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
