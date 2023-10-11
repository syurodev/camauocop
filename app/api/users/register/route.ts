import * as byrypt from "bcrypt"

import User from "@/lib/models/users";
import { connectToDB } from "@/lib/utils";

interface RequestBody {
  email: string;
  password: string;
  username?: string;
  provider?: string;
  image?: string;
  email_verified?: boolean;
}

export async function POST(req: Request) {
  try {
    await connectToDB()
    const body: RequestBody = await req.json()

    const query: { $or: any[] } = { $or: [] };

    if (body.username) {
      query.$or.push({ username: body.username });
    }

    if (body.email) {
      query.$or.push({ email: body.email });
    }

    if (query.$or.length === 0) {
      const res = {
        code: 400,
        message: 'Vui lòng cung cấp tên đăng nhập hoặc email',
      };
      return new Response(JSON.stringify(res));
    }

    const userExistting = await User.findOne(query)

    if (userExistting) {
      const res = {
        code: 400,
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

    const data = {
      code: 200,
      data: result
    }
    return new Response(JSON.stringify(data))
  } catch (error) {
    console.log(error)
    return new Response(JSON.stringify({ code: 400, message: "Lỗi tạo người dùng" }))
  }
}