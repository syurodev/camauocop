import mongoose, { Document, Schema } from 'mongoose';

export interface ITourType extends Document {
  name: string;
}

const TourTypeSchema: Schema = new Schema({
  name: { type: String, required: true },
});

export default mongoose.models.TourType || mongoose.model<ITourType>('TourType', TourTypeSchema);