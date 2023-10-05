import mongoose, { Document, Schema } from 'mongoose';
import Shop from './shop';

export interface IProductTypes extends Document {
  userId: string
  name: string;
}

const ProductTypesSchema: Schema = new Schema({
  shopId: { type: Schema.Types.ObjectId, ref: Shop, required: true },
  name: { type: String, required: true },
});

export default mongoose.models.ProductType || mongoose.model<IProductTypes>('ProductType', ProductTypesSchema);