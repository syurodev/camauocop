import mongoose, { Document, Schema } from 'mongoose';
import User from './users';

export interface IProductTypes extends Document {
  userId: string
  name: string;
}

const ProductTypesSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: User, required: true },
  name: { type: String, required: true },
});

export default mongoose.models.ProductType || mongoose.model<IProductTypes>('ProductType', ProductTypesSchema);