import mongoose, { Document, Schema } from "mongoose";
import User from "./users";
import Product from "./products";

export interface IComment extends Document {
  userId: string;
  productId: string;
  text: string;
  images: string[];
  parentId: string | null;
  createdAt: Date;
}

const CommentSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: User, required: true },
    productId: { type: Schema.Types.ObjectId, ref: Product, required: true },
    text: { type: String, required: true },
    images: [{ type: String, default: [] }],
    parentId: { type: Schema.Types.ObjectId, default: null },
    createdAt: { type: Date, default: Date.now },
  }
);

export default mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);
