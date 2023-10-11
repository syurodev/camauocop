import mongoose, { Document, Schema } from 'mongoose';
import User from './users';
import Product from './products';

export interface IFavoriteSchema extends Document {
  userId: mongoose.Types.ObjectId;
  products: {
    productId: mongoose.Types.ObjectId,
    addedDate: Date
  }[]
}

const FavoriteSchema: Schema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: User,
    required: true
  },
  products: [{
    productId: {
      type: mongoose.Types.ObjectId,
      ref: Product,
      required: true
    },
    addedDate: {
      type: Date,
      default: Date.now
    }
  }]
});

export default mongoose.models.Favorite || mongoose.model<IFavoriteSchema>('Favorite', FavoriteSchema);
