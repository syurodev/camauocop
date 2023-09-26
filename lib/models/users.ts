import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  address?: [{
    province: string;
    district: string;
    ward: string;
  }];
  role?: "individual" | "shop" | "business";
  name?: string;
  phone?: number;
  provider: string;
  image: string;
  email_verified?: boolean;
  productTypes?: string[];
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String },
    phone: { type: Number },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email_verified: { type: Boolean, required: true, default: false },
    address: [{
      province: {
        type: String,
      },
      district: {
        type: String,
      },
      ward: {
        type: String,
      }
    }],
    image: { type: String, default: "" },
    role: {
      type: String,
      enum: ["individual", "shop", "business"],
      required: true,
      default: "individual",
    },
    provider: { type: String, required: true, default: "credentials" },
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
