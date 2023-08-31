import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
}

const ProductTypesSchema: Schema = new Schema({
  name: { type: String, required: true },
});

export default mongoose.models.ProductType || mongoose.model<IProduct>('ProductType', ProductTypesSchema);