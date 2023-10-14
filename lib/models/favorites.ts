import mongoose, { Document, Schema } from 'mongoose';
import User from './users';
import Product from './products';

export interface IFavorite extends Document {
  userId: string;
  products: {
    productId: string,
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

export default mongoose.models.Favorite || mongoose.model<IFavorite>('Favorite', FavoriteSchema);
