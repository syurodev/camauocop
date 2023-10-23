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
  fee: number;
  phone: string;
  type: ShopType;
  status: ShopStatus;
  delivery: string[]
  staffs: [{
    staffId: string,
    staffStatus: StaffStatus
  }]
  image?: string;
  tax?: string;
}

const ShopSchema: Schema = new Schema(
  {
    auth: { type: Schema.Types.ObjectId, ref: User, required: true },
    name: { type: String, required: true },
    fee: { type: Number, default: 5 },
    image: { type: String, default: "" },
    phone: { type: String, required: true },
    status: { type: String, required: true, default: "active" },
    delivery: [{ type: String, required: true }],
    staffs: [{
      staffId: {
        type: Schema.Types.ObjectId, ref: User, required: true,
      },
      staffStatus: {
        type: String, default: "pending"
      },
      dateJoining: {
        type: Date, default: new Date
      },
    }],
    type: { type: String, required: true, default: "personal" },
    tax: { type: String },
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
