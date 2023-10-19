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
    shop_id: {
      GHN?: number,
      GHTK?: string
    },
    auth: {
      avatar: string,
      _id: string,
      username?: string,
      email?: string,
      phone?: string
    }
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
  orderStatus: 'pending' | 'processed' | 'shipped' | 'delivered' | 'canceled',
  orderDate: string,
  delivery: string[],
  province: string,
  district: string,
  ward: string,
  apartment: string,
}

type IOrder = {
  _id: string,
  buyerId: {
    _id: string,
    username: string
    email: string
    image: string
    phone: string
  },
  shopId: {
    _id: string,
    name: string,
    auth: {
      phone: string,
    }
  },
  totalAmount: number,
  orderStatus: 'pending' | 'processed' | 'shipped' | 'delivered' | 'canceled',
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
  shopPhone: string
  totalAmount: number,
  status: OrderStatus,
  productImage: string,
  orderDate?: Date
  orderDateConvert?: string
}

type OrderStatus = 'pending' | 'processed' | 'shipped' | 'delivered' | 'canceled'

type IOrderResponse = {
  code: number,
  data: IOrders[] | [],
  totalItems: number,
  totalPages: number,
}

type IOrderDetailResponse = {
  code: number,
  data: string | null,
  message?: string
}