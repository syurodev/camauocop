import * as byrypt from "bcrypt"

import User, { IUser } from "@/lib/models/users";
import Shop from "@/lib/models/shop";
import { connectToDB } from "@/lib/utils";
import { signJwtAccessToken } from "@/lib/utils";

interface RequestBody {
  username: string,
  password: string
}

export async function POST(req: Request) {
  try {
    const body: RequestBody = await req.json()

    await connectToDB()

    const user: IUser | null = await User.findOne({ $or: [{ username: body.username }, { email: body.username }] })
    const { password, ...userWithoutPassword } = (user as any)._doc;

    if (user && (await byrypt.compare(body.password, user.password))) {
      const accessToken = signJwtAccessToken(userWithoutPassword);

      let result = {
        ...userWithoutPassword,
        accessToken
      }

      if (user.role !== "individual") {
        const shop = await Shop.findOne({ auth: userWithoutPassword._id })

        if (shop) {
          const shopId = shop._id
          result = { ...result, shopId }
        }
      }

      return new Response(JSON.stringify(result))
    } else return new Response(JSON.stringify(null))
  } catch (error) {
    console.log(error)
    return new Response(JSON.stringify(null))
  }
}