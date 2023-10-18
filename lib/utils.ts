import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import mongoose, { ConnectOptions } from "mongoose";
import jwt, { JwtPayload } from "jsonwebtoken";

// shadcn-ui
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Connect DB
let isConnected = false;
export const connectToDB = async () => {
  mongoose.set("strictQuery", true)

  if (isConnected) {
    console.log("DB is adready connected")
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI as string, {
      dbName: "sea-market-hub",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions)
    isConnected = true;

    console.log("DB connect successfully");
  } catch (error) {
    console.log(error)
  }
}

// JWT
interface SignOptions {
  expiresIn?: string | number;
}

const DEFAULT_SIGN_OPTION: SignOptions = {
  expiresIn: "1d"
}

export function signJwtAccessToken(payload: JwtPayload, options: SignOptions = DEFAULT_SIGN_OPTION) {
  const secret_key = process.env.SECRET_KEY

  const token = jwt.sign(payload, secret_key!, options)

  return token
}

export function verifyJwtToken(token: string) {
  try {
    const secret_key = process.env.SECRET_KEY

    const decoded = jwt.verify(token, secret_key!)

    return decoded as JwtPayload
  } catch (error) {
    console.log(error)
    return null
  }
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}