export interface IProducts {
  _id: string;
  sellerId: {
    _id: string;
    username?: string;
    name?: string;
  };
  productType: {
    _id: string;
    name: string;
  };
  name: string;
  price: number;
  images: string[];
}

export interface IAddProductTypes {
  _id: string;
  name: string;
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