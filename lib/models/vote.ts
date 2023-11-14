import mongoose, { Document, Schema } from 'mongoose';
import User from './users';
import Product from './products';

export interface IVote extends Document {
  productId: string;
  vote: {
    userId: string,
    rate: 1 | 2 | 3 | 4 | 5
  }[]
}

const VoteSchema: Schema = new Schema({
  productId: {
    type: mongoose.Types.ObjectId,
    ref: Product,
    required: true
  },
  vote: [{
    userId: {
      type: mongoose.Types.ObjectId,
      ref: User,
      required: true
    },
    rate: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      required: true
    }
  }]
});

export default mongoose.models.Vote || mongoose.model<IVote>('Vote', VoteSchema);
