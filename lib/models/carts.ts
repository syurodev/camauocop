import mongoose, { Document, Schema } from 'mongoose';
import User from './users';
import Product from './products';

interface IProductInCart {
  productId: string;
  quantity: number;
  addedDate: Date;
}

export interface ICart extends Document {
  userId: string;
  products: IProductInCart[];
  totalAmount: number;
}

const CartSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: User, required: true },
  products: [{
    productId: { type: Schema.Types.ObjectId, ref: Product, required: true },
    quantity: { type: Number, required: true },
    addedDate: { type: Date, default: Date.now }
  }],
  totalAmount: { type: Number, required: true },
});

export default mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema);