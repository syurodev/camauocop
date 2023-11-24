type IProducts = {
  _id: string;
  productName: string;
  productImages: string[];
  productPrice: number;
  specialty: boolean;
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

type IProductDetail = {
  _id: string;
  productName: string;
  productDescription: {
    type: string;
    content: any[];
  };
  retail: boolean;
  packageOptions: ProductPack[];
  productPrice: number;
  productSold: number;
  rating: number;
  numberOfRatings: number;
  hasRated?: boolean;
  userRating?: number;
  specialty: boolean;
  productQuantity: number;
  productImages: string[];
  productCreatedAt: Date;
  productDeletedAt?: Date;
  shopId: string;
  shopInfo: {
    delivery: string[]
    status: ShopStatus
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
    name: string
    phone: string;
    image: string;
  }
  productTypeName: string;
  productTypeId: string;
  isFavorite?: boolean
};

type ProductPack = {
  unit: WeightUnit;
  weight: number;
  price: number;
  length: number;
  width: number;
  height: number;
}