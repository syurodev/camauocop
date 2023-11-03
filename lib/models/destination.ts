import mongoose, { Document, Schema } from 'mongoose';

export interface IDestination extends Document {
  name: string;
  images: string[];
  description: string;
}

const DestinationSchema: Schema = new Schema({
  name: { type: String, required: true },
  images: [{ type: String, required: true }],
  description: { type: String, required: true },
});

export default mongoose.models.Destination || mongoose.model<IDestination>('Destination', DestinationSchema);