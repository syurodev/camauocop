import mongoose, { Document, Schema } from 'mongoose';
import Product from './products';
import User from './users';
import Bid from './bids';

export interface IAuction extends Document {
  productId: string;
  startTime: Date;
  endTime: Date;
  startingPrice: number;
  highestBid: number;
  status: boolean;
  highestBidderId: string;
  bids: Schema.Types.ObjectId[]; // Mảng các tham chiếu đến các lần đặt giá
}

const AuctionSchema: Schema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: Product, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  startingPrice: { type: Number, required: true },
  status: { type: Boolean, required: true },
  highestBid: { type: Number, default: 0 },
  highestBidderId: { type: Schema.Types.ObjectId, ref: User },
  bids: [{ type: Schema.Types.ObjectId, ref: Bid }], // Mảng các tham chiếu
});

export default mongoose.models.Auction || mongoose.model<IAuction>('Auction', AuctionSchema);