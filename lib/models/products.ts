import mongoose, { Document, Schema } from "mongoose";
import ProductType from "./productTypes";
import Shop from "./shop";

export interface IProduct extends Document {
  _id: string;
  shopId: string;
  productType: string;
  name: string;
  description: {
    time: number;
    blocks: any[];
    version: string;
  };
  retailPrice?: number;
  retail: boolean;
  quantity: number;
  packageOptions?: {
    unit: string;
    weight: number;
    price: number;
  }[];
  images: string[];
  sold: number;
  createAt: Date;
  deleteAt?: Date;
}

const ProductSchema: Schema = new Schema(
  {
    shopId: { type: Schema.Types.ObjectId, ref: Shop, required: true },
    productType: {
      type: Schema.Types.ObjectId,
      ref: ProductType,
      required: true,
    },
    name: { type: String, required: true },
    description: {
      time: { type: Number },
      blocks: { type: Array },
      version: { type: String },
    },
    retailPrice: { type: Number, default: 0, required: true },
    retail: { type: Boolean, default: false, required: true },
    quantity: { type: Number, required: true, default: 0 },
    sold: { type: Number, required: true, default: 0 },
    packageOptions: [
      {
        unit: { type: String, required: true },
        weight: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    images: [{ type: String }],
    deleteAt: [{ type: Date }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Product ||
  mongoose.model<IProduct>("Product", ProductSchema);
