import mongoose, { Document, Schema } from 'mongoose';

export interface IDestination extends Document {
  name: string;
  images: string[];
  description: {
    type: string;
    content: any[];
  };
}

const DestinationSchema: Schema = new Schema({
  name: { type: String, required: true },
  images: [{ type: String, required: true }],
  description: {
    type: { type: String },
    content: { type: Array },
  },
});

export default mongoose.models.Destination || mongoose.model<IDestination>('Destination', DestinationSchema);