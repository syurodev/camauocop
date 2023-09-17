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
  totalPages: number;
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

// export interface Products {
//   description: {
//     time: number;
//     blocks: any[];
//     version: string;
//   };
//   _id: string;
//   sellerId: {
//     _id: string;
//     username: string;
//     image: string;
//   };
//   productType: {
//     _id: string;
//     name: string;
//   };
//   name: string;
//   price: number;
//   images: string[];
//   createdAt: Date;
//   sold: number;
// }
