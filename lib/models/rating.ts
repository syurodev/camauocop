import mongoose, { Document, Schema } from 'mongoose';
import User from './users';
import Product from './products';

export interface IRating extends Document {
  productId: string;
  users: {
    userId: string,
    point: 1 | 2 | 3 | 4 | 5,
    addedDate: Date
  }[]
}

const RatingSchema: Schema = new Schema({
  productId: {
    type: mongoose.Types.ObjectId,
    ref: Product,
    required: true
  },
  users: [{
    userId: {
      type: mongoose.Types.ObjectId,
      ref: User,
      required: true
    },
    point: { type: Number, enum: [1, 2, 3, 4, 5], require: true, default: 1 },
    addedDate: {
      type: Date,
      default: Date.now
    }
  }]
});

export default mongoose.models.Rating || mongoose.model<IRating>('Rating', RatingSchema);
