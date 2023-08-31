import mongoose, { Document, Schema } from 'mongoose';
import User from './users';
import ProductType from './productTypes';

export interface IProduct extends Document {
  sellerId: string;
  productType: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  images: string[];
  createAt: Date;
  deleteAt?: Date;
}

const ProductSchema: Schema = new Schema({
  sellerId: { type: Schema.Types.ObjectId, ref: User, required: true },
  productType: { type: Schema.Types.ObjectId, ref: ProductType, required: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  images: [{ type: String }],
  deleteAt: [{ type: Date }],
}, {
  timestamps: true
}
);

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);