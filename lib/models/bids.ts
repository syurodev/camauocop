import mongoose, { Document, Schema } from 'mongoose';
import User from './users';
import Auction from './auctions';

export interface IBid extends Document {
  bidderId: string;
  auctionId: string;
  bidAmount: number;
  bidTime: Date;
  message: string;
}

const BidSchema: Schema = new Schema({
  bidderId: { type: Schema.Types.ObjectId, ref: User, required: true },
  auctionId: { type: Schema.Types.ObjectId, ref: Auction, required: true },
  bidAmount: { type: Number, required: true },
  bidTime: { type: Date, default: Date.now },
  message: { type: String },
});

export default mongoose.models.Bid || mongoose.model<IBid>('Bid', BidSchema);
