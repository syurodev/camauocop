import mongoose, { Document, Schema } from 'mongoose';

export interface IProductTypes extends Document {
  name: string;
}

const ProductTypesSchema: Schema = new Schema({
  name: { type: String, required: true },
});

export default mongoose.models.ProductType || mongoose.model<IProductTypes>('ProductType', ProductTypesSchema);