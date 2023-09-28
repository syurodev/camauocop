import mongoose, { Document, Schema } from "mongoose";
import User from "./users";

export interface IShop extends Document {
  auth: string;
  shop_id: [any];
  address?: [{
    province: string;
    district: string;
    ward: string;
    apartment: string;
  }];
  name?: string;
}

const ShopSchema: Schema = new Schema(
  {
    auth: { type: Schema.Types.ObjectId, ref: User, required: true },
    name: { type: String },
    address: [{
      province: {
        type: String,
      },
      district: {
        type: String,
      },
      ward: {
        type: String,
      },
      apartment: {
        type: String,
      }
    }],
    shop_id: [Schema.Types.Mixed],
  },
  { timestamps: true }
);

export default mongoose.models.Shop || mongoose.model<IShop>("Shop", ShopSchema);
