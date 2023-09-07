import mongoose, { Document, Schema } from 'mongoose';
import User from './users';
import ProductType from './productTypes';

export interface IProduct extends Document {
  sellerId: string;
  productType: string;
  name: string;
  description: {
    time: number;
    blocks: any[];
    version: string;
  };
  price: number;
  quantity: number;
  images: string[];
  createAt: Date;
  deleteAt?: Date;
  auction: boolean;
}

const ProductSchema: Schema = new Schema({
  sellerId: { type: Schema.Types.ObjectId, ref: User, required: true },
  productType: { type: Schema.Types.ObjectId, ref: ProductType, required: true },
  name: { type: String, required: true },
  description: {
    time: { type: Number },
    blocks: { type: Array },
    version: { type: String },
  },
  price: { type: Number, required: true },
  sold: { type: Number, required: true, default: 0 },
  quantity: { type: Number, required: true },
  images: [{ type: String }],
  deleteAt: [{ type: Date }],
  auction: { type: Boolean, required: true, default: false }
}, {
  timestamps: true
}
);

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);