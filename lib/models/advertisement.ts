import mongoose, { Document, Schema } from "mongoose";
import Shop from "./shop";

export interface IAdvertisement extends Document {
  shopId: string;
  image: string;
  note: string;
  type: AdvertisementType;
  status: AdvertisementStatus;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
}

const AdvertisementSchema: Schema = new Schema(
  {
    shopId: { type: Schema.Types.ObjectId, ref: Shop, required: true },
    image: { type: String, required: true },
    status: { type: String, default: "waiting" },
    type: { type: String, default: "home" },
    note: { type: String, default: "" },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
  }
);

export default mongoose.models.Advertisement || mongoose.model<IAdvertisement>("Advertisement", AdvertisementSchema);
