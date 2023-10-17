import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  address?: [{
    province: string;
    district: string;
    ward: string;
    apartment: string;
  }];
  role?: "individual" | "shop" | "business" | "admin";
  phone?: string;
  provider: string;
  image: string;
  email_verified?: boolean;
  phone_verified?: boolean;
  productTypes?: string[];
}

const UserSchema: Schema = new Schema(
  {
    phone: { type: String, default: "" },
    username: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email_verified: { type: Boolean, required: true, default: false },
    phone_verified: { type: Boolean, required: true, default: false },
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

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
