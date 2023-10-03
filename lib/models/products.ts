// import mongoose, { Document, Schema } from "mongoose";
// import User from "./users";
// import ProductType from "./productTypes";

// export interface IProductSchema extends Document {
//   _id: string;
//   sellerId: string;
//   productType: string;
//   name: string;
//   description: {
//     time: number;
//     blocks: any[];
//     version: string;
//   };
//   price: number;
//   quantity: number;
//   images: string[];
//   createAt: Date;
//   deleteAt?: Date;
//   auction: boolean;
//   sold: number;
// }

// const ProductSchema: Schema = new Schema(
//   {
//     sellerId: { type: Schema.Types.ObjectId, ref: User, required: true },
//     productType: {
//       type: Schema.Types.ObjectId,
//       ref: ProductType,
//       required: true,
//     },
//     name: { type: String, required: true },
//     description: {
//       time: { type: Number },
//       blocks: { type: Array },
//       version: { type: String },
//     },
//     price: { type: Number, required: true },
//     sold: { type: Number, required: true, default: 0 },
//     quantity: { type: Number, required: true },
//     images: [{ type: String }],
//     deleteAt: [{ type: Date }],
//     auction: { type: Boolean, required: true, default: false },
//   },
//   {
//     timestamps: true,
//   }
// );

// export default mongoose.models.Product ||
//   mongoose.model<IProductSchema>("Product", ProductSchema);


import mongoose, { Document, Schema } from "mongoose";
import User from "./users";
import ProductType from "./productTypes";

export interface IProduct extends Document {
  _id: string;
  sellerId: string;
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
    sellerId: { type: Schema.Types.ObjectId, ref: User, required: true },
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
