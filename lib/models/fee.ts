import mongoose, { Document, Schema } from 'mongoose';
import Order from "./orders"

export interface IFee extends Document {
  order_id: string;
  feeAmount: number;
  status: FeeStatus;
}

const FeeSchema: Schema = new Schema({
  order_id: { type: Schema.Types.ObjectId, ref: Order, required: true },
  feeAmount: { type: Number, required: true },
  status: { type: String, required: true, default: "pending" },
}, {
  timestamps: true,
});

export default mongoose.models.Fee || mongoose.model<IFee>('Fee', FeeSchema);

