import mongoose, { Document, Schema } from 'mongoose';
import User from './users';
import Product from './products';

export interface IProductInCart {
  productId: string;
  addedDate: Date;
}

export interface ICart extends Document {
  userId: string;
  products: IProductInCart[];
}

const CartSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: User, required: true },
  products: [{
    productId: { type: Schema.Types.ObjectId, ref: Product, required: true },
    addedDate: { type: Date, default: Date.now }
  }],
});

export default mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema);