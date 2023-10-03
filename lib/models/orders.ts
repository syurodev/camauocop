import mongoose, { Document, Schema } from 'mongoose';
import Product from './products';
import User from './users';

interface IProductInOrder {
  productId: string;
  productSnapshot: {
    name: string;
    price: number;
    // Các trường khác của sản phẩm cần lưu trữ tại thời điểm đặt hàng
  };
  quantity: number;
}

export interface IOrderSchema extends Document {
  buyerId: string;
  products: IProductInOrder[];
  totalAmount: number;
  orderStatus: 'pending' | 'processed' | 'shipped' | 'delivered';
  orderDate: Date;
}

const OrderSchema: Schema = new Schema({
  buyerId: { type: Schema.Types.ObjectId, ref: User, required: true },
  products: [{
    productId: { type: Schema.Types.ObjectId, ref: Product, required: true },
    productSnapshot: { type: Object, required: true },
    quantity: { type: Number, required: true },
  }],
  totalAmount: { type: Number, required: true },
  orderStatus: { type: String, enum: ['pending', 'processed', 'shipped', 'delivered'], default: 'pending' },
  orderDate: { type: Date, required: true, default: Date.now() }
});

export default mongoose.models.Order || mongoose.model<IOrderSchema>('Order', OrderSchema);