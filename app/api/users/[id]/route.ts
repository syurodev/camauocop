import User from "@/lib/models/users";
import { connectToDB } from "@/lib/utils";
import { verifyJwtToken } from "@/lib/utils";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const accessToken = req.headers.get("authorization")

  if (!accessToken || !verifyJwtToken(accessToken)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
  }

  await connectToDB();

  const userDetail = await User.findOne({ _id: params.id });

  const { password, ...userWithoutPassword } = (userDetail as any)._doc;

  return new Response(JSON.stringify(userWithoutPassword))
}