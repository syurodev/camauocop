"use server"

import Comment from "@/lib/models/comments";
import { connectToDB } from "@/lib/utils"

export type CommentData = {
  productId: string,
  userId: string,
  text: string,
  images?: string[],
  parentId?: string
}

export const comment = async (data: CommentData) => {
  try {
    await connectToDB()

    const comment = new Comment({
      userId: data.userId,
      productId: data.productId,
      text: data.text,
      images: data.images || [],
      parentId: null,
    });

    await comment.save()

    const commentData = await Comment.findById(comment._id)
      .populate({
        path: "userId",
        select: "image username email"
      })

    const result: CommentResponse = {
      _id: commentData._id.toString(),
      userId: commentData.userId._id.toString(),
      productId: commentData.productId.toString(),
      text: commentData.text,
      images: commentData.images || [],
      parentId: commentData.parentId || null,
      createdAt: commentData.createdAt.toISOString(),
      userImage: commentData.userId.image,
      username: commentData.userId.username || commentData.userId.email,
    }

    return {
      code: 200,
      message: "successfully",
      data: result
    }
  } catch (error) {
    console.log(error)
    return {
      code: 500,
      message: "Lỗi hệ thống vui lòng thử lại",
      data: null
    }
  }
}

export const reply = async (data: CommentData) => {
  try {
    await connectToDB()

    const comment = new Comment({
      userId: data.userId,
      productId: data.productId,
      text: data.text,
      images: data.images || [],
      parentId: data.parentId,
    });

    const result = await comment.save()


    return {
      code: 200,
      message: "successfully"
    }
  } catch (error) {
    console.log(error)
    return {
      code: 500,
      message: "Lỗi hệ thống vui lòng thử lại"
    }
  }
}

export const getComment = async (productId: string) => {
  try {
    const comments = await Comment.find({ productId: productId })
      .populate({
        path: "userId",
        select: "image username email"
      })
      .sort({ createdAt: -1 })

    const result: CommentResponse[] = comments.map(comment => {
      return {
        _id: comment._id.toString(),
        userId: comment.userId._id.toString(),
        productId: comment.productId.toString(),
        text: comment.text,
        images: comment.images,
        parentId: comment.parentId || null,
        createdAt: comment.createdAt.toISOString(),
        userImage: comment.userId.image,
        username: comment.userId.username || comment.userId.email
      }
    })

    return {
      code: 200,
      message: "success",
      data: result || []
    }

  } catch (error) {
    console.log(error)
    return {
      code: 500,
      message: "Lỗi hệ thống vui lòng thử lại"
    }
  }
}