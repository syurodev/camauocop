import mongoose, { Document, Schema } from 'mongoose';

export interface ITransportation extends Document {
  name: string;
}

const TransportationSchema: Schema = new Schema({
  name: { type: String, required: true },
});

export default mongoose.models.Transportation || mongoose.model<ITransportation>('Transportation', TransportationSchema);