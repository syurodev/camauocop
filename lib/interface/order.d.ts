type OrderStatus = 'pending' | 'processed' | 'shipped' | 'delivered' | 'canceled'
type OrderType = 'book' | 'buy'

type IOrderDetail = {
  _id: string
  buyerId: {
    _id: string,
    avatar: string
    username?: string,
    email?: string,
    phone?: string
  },
  shopId: {
    _id: string,
    name: string,
    avatar: string,
    phone: string
    shop_id: {
      GHN?: number,
      GHTK?: string
    },
  },
  products: [{
    productId: string,
    productSnapshot: {
      name: string,
      images: string[],
      retail: boolean,
      retailPrice: number
      productType: string
      packageOptions: [
        unit: WeightUnit,
        weight: number,
        price: number
      ]
    },
    quantity: number,
    unit: WeightUnit,
    weight: number,
    price: number,
    retail: boolean,
    length: number;
    width: number;
    height: number;
  }],
  totalAmount: number,
  fee: number,
  orderStatus: OrderStatus,
  orderType: OrderType,
  orderDate: string,
  delivery: string[],
  province: string,
  district: string,
  ward: string,
  apartment: string,
  note: string;
}

type IOrder = {
  _id: string,
  buyerId: {
    _id: string,
    username: string
    email: string
    image: string
    phone: string
    role: UserRole
  },
  shopId: {
    _id: string,
    name: string,
    image: string,
    phone: string,
  },
  totalAmount: number,
  orderStatus: OrderStatus,
  orderType: OrderType,
  products: [{
    productId: string,
    productSnapshot: {
      name: string,
      productType: string,
      images: string[],
      retail: boolean,
      retailPrice: number
      packageOptions: [
        unit: WeightUnit,
        weight: number,
        price: number
      ]
    },
    quantity: number,
    unit: string,
    price: number,
    retail: boolean,
    weight: number,
    _id: string
    length?: number;
    width?: number;
    height?: number;
  }],
  orderDate?: Date
  orderDateConvert?: string
}

type IOrders = {
  _id: string,
  buyerId: strint,
  buyerUsername: string,
  buyerImage: string,
  buyerPhone: string,
  buyerEmail?: string,
  shopId: string
  shopName: string
  shopImage: string
  shopPhone: string
  totalAmount: number,
  status: OrderStatus,
  orderType: OrderType,
  productImage: string,
  orderDate?: Date
  orderDateConvert?: string
}

type IOrderResponse = {
  code: number,
  data: string,
  totalItems: number,
  totalPages: number,
}

type IOrderDetailResponse = {
  code: number,
  data: string | null,
  message?: string
}