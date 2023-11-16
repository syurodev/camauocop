import mongoose, { Document, Schema } from 'mongoose';
import Product from './products';
import User from './users';
import Shop from './shop';

interface IProductInOrder {
  productId: string;
  productSnapshot: {
    name: string,
    images: string[],
    retail: boolean,
    retailPrice: number,
    productType: string,
    packageOptions: [
      unit: WeightUnit,
      weight: number,
      price: number
    ]
  };
  quantity: number;
  weight: number;
  unit: string;
  price: number;
  retail: boolean;
}

export interface IOrderSchema extends Document {
  buyerId: string;
  shopId: string;
  products: IProductInOrder[];
  totalAmount: number;
  orderStatus: OrderStatus;
  orderType: OrderType,
  orderDate: Date;
  shippingCode?: string;
  delivery: string[];
  province: string;
  district: string;
  ward: string;
  apartment: string;
  note?: string;
  length?: number;
  width?: number;
  height?: number;
}

const OrderSchema: Schema = new Schema({
  buyerId: { type: Schema.Types.ObjectId, ref: User, required: true },
  shopId: { type: Schema.Types.ObjectId, ref: Shop, required: true },
  products: [{
    productId: { type: Schema.Types.ObjectId, ref: Product, required: true },
    productSnapshot: { type: Object, required: true },
    quantity: { type: Number },
    weight: { type: Number },
    unit: { type: String },
    price: { type: Number },
    length: { type: Number, default: 0 },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    retail: { type: Boolean, default: false }
  }],
  totalAmount: { type: Number, required: true },
  shippingCode: { type: String, default: "" },
  orderStatus: { type: String, enum: ['pending', 'processed', 'shipped', 'delivered', 'canceled'], default: 'pending' },
  orderType: { type: String, enum: ['book', 'buy'], default: 'buy' },
  orderDate: { type: Date, required: true, default: Date.now() },
  delivery: { type: [String] },
  province: { type: String },
  district: { type: String },
  ward: { type: String },
  apartment: { type: String },
  note: { type: String, default: "" },
});

export default mongoose.models.Order || mongoose.model<IOrderSchema>('Order', OrderSchema);