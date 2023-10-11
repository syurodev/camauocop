import mongoose, { Document, Schema } from "mongoose";
import User from "./users";

export interface IShop extends Document {
  auth: string;
  shop_id: {
    GHN?: number;
    GHTK?: string | number;
  };
  address: [{
    province: string;
    district: string;
    ward: string;
    apartment: string;
    GHN_district_id?: number;
    GHN_ward_code?: string;
  }];
  name: string;
  delivery: string[]
}

const ShopSchema: Schema = new Schema(
  {
    auth: { type: Schema.Types.ObjectId, ref: User, required: true },
    name: { type: String, required: true },
    delivery: [{ type: String, required: true }],
    address: [{
      province: {
        type: String, required: true
      },
      district: {
        type: String, required: true
      },
      ward: {
        type: String, required: true
      },
      apartment: {
        type: String, required: true
      },
      GHN_district_id: {
        type: Number,
        default: 0
      },
      GHN_ward_code: {
        type: String,
        default: ""
      }
    }],
    shop_id: {
      GHN: { type: Number, default: 0 },
      GHTK: { type: Schema.Types.Mixed, default: 0 }
    },
  },
  { timestamps: true }
);

export default mongoose.models.Shop || mongoose.model<IShop>("Shop", ShopSchema);
