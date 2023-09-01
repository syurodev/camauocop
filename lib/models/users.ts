import mongoose, { Document, Schema } from 'mongoose';
import ProductType from './productTypes';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  address?: string;
  role?: 'individual' | 'shop' | 'business';
  name?: string;
  phone?: number;
  provider: string;
  image: string;
  email_verified?: boolean;
  productTypes?: string[];
}

const UserSchema: Schema = new Schema({
  name: { type: String },
  phone: { type: Number },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email_verified: { type: Boolean, required: true, default: false },
  address: { type: String, default: '' },
  image: { type: String, default: '' },
  role: { type: String, enum: ['individual', 'shop', 'business'], required: true, default: 'individual' },
  provider: { type: String, required: true, default: 'credentials' },
  productTypes: [
    {
      type: mongoose.Types.ObjectId,
      ref: ProductType,
    }
  ]
},
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);