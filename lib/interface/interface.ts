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