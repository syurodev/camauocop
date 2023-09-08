export interface IProducts {
  _id: string;
  productName: string;
  productTypeName: string;
  sellerName: string;
  sellerAvatar: string;
  productImages: string[];
  productPrice: number;
}

export interface IAddProductTypes {
  _id: string;
  name: string;
  userId?: string
}

export interface PopupProps {
  children: React.ReactElement,
  content: React.ReactElement,
  trigger?:
  | "mouseenter focus"
  | "focus"
  | "click",
  [key: string]: any
}

export interface IProductDetail {
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
}