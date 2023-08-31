import * as byrypt from "bcrypt"

import User from "@/lib/models/users";
import { connectToDB } from "@/lib/utils";

interface RequestBody {
  username: string;
  email: string;
  password: string;
  provider?: string;
  image?: string;
  email_verified?: boolean;
}

export async function POST(req: Request) {
  const body: RequestBody = await req.json()
  await connectToDB()

  const userExistting = await User.findOne({ $or: [{ username: body.username }, { email: body.email }] })

  if (userExistting) {
    const res = {
      status: 400,
      message: 'Tên đăng nhập hoặc email đã tồn tại',
    }
    return new Response(JSON.stringify(res))
  }

  const user = new User({
    username: body.username,
    password: await byrypt.hash(body.password, 10),
    email: body.email,
    provider: body?.provider || "credentials",
    image: body?.image || "",
    email_verified: body?.email_verified || false,
    role: "individual"
  })

  await user.save()

  const { password, ...result } = (user as any)._doc;

  return new Response(JSON.stringify(result))
}