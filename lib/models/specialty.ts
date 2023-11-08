import mongoose, { Document, Schema } from 'mongoose';

export interface ISpecialty extends Document {
  name: string;
  description: {
    type: string;
    content: any[];
  };
  images: string[];
}

const SpecialtySchema: Schema = new Schema({
  name: { type: String, required: true },
  description: {
    type: { type: String },
    content: { type: Array },
  },
  images: [{ type: String }],
});

export default mongoose.models.Specialty || mongoose.model<ISpecialty>('Specialty', SpecialtySchema);