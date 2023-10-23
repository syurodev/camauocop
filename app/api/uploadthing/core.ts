import { createUploadthing, type FileRouter } from "uploadthing/next";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next"

const f = createUploadthing();

const auth = async () => {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error("Could not get server session")
  }
  return { userId: session?.user._id }
}

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  avatarImage: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    .middleware(() => auth())
    .onUploadComplete(() => { }),
  productImages: f({ image: { maxFileSize: "8MB", maxFileCount: 6 } })
    .middleware(() => auth())
    .onUploadComplete(() => { })
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;