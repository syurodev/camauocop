import * as byrypt from "bcrypt"

import User from "@/lib/models/users";
import { connectToDB } from "@/lib/utils";
import { signJwtAccessToken } from "@/lib/utils";

interface RequestBody {
  username: string,
  password: string
}

export async function POST(req: Request) {
  const body: RequestBody = await req.json()

  await connectToDB()

  const user = await User.findOne({ $or: [{ username: body.username }, { email: body.username }] })

  if (user && (await byrypt.compare(body.password, user.password))) {
    const { password, ...userWithoutPassword } = (user as any)._doc;
    const accessToken = signJwtAccessToken(userWithoutPassword);

    const result = {
      ...userWithoutPassword,
      accessToken
    }
    return new Response(JSON.stringify(result))
  } else return new Response(JSON.stringify(null))
}