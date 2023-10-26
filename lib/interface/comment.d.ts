type CommentResponse = {
  _id: string
  userId: string
  productId: string
  text: string
  images?: string[]
  parentId: string | null
  createdAt: string
  userImage: string
  username: string
}