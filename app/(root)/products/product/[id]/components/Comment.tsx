"use client"

import React, { useEffect, useState } from 'react'
import { Button, Image, Spinner, Textarea } from '@nextui-org/react'
import { MdClose } from "react-icons/md"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useDispatch } from 'react-redux'

import { UploadButton } from '@/lib/uploadthing'
import { useAppSelector } from '@/redux/store'
import { CommentData, comment, getComment } from '@/actions/comment'
import { pushComment, setComments } from '@/redux/features/comment-slice'
import CommentItem from '@/components/card/Comment'

type IProps = {
  setOpenCommemt: React.Dispatch<React.SetStateAction<boolean>>
  productId: string,
  openCommemt: boolean,
}

const Comment: React.FC<IProps> = ({ setOpenCommemt, productId, openCommemt = true }) => {
  const dispatch = useDispatch()
  const session = useAppSelector(state => state.sessionReducer.value)
  const [replyComment, setReplyComment] = useState<boolean>(false)
  const [commentsLoading, setCommentsLoading] = useState<boolean>(false)
  const [commentSubmit, setCommentSubmit] = useState<boolean>(false)
  const [images, setImages] = useState<string[]>([])

  useEffect(() => {
    const fetchApi = async () => {
      setCommentsLoading(true)
      const res = await getComment(productId)
      setCommentsLoading(false)
      if (res.code === 200) {
        dispatch(setComments(res.data!))
      }
    }
    if (openCommemt) {
      fetchApi()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, openCommemt])

  const CommentSchema = z.object({
    userId: z.string().nonempty("Vui lòng đăng nhập để đăng bình luận"),
    productId: z.string(),
    text: z.string().nonempty("Vui lòng nhập nội dung bình luận"),
    images: z.array(z.string().url().optional()).optional(),
    parentId: z.string().optional(),
  })

  type ICommentSchema = z.infer<typeof CommentSchema>

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm<ICommentSchema>({
    resolver: zodResolver(CommentSchema),
  })

  useEffect(() => {
    if (session) {
      setValue("userId", session.user._id)
      setValue("productId", productId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  const onSubmit = async (data: ICommentSchema) => {
    setCommentSubmit(true)
    if (replyComment) {
      console.log(data)
    } else {
      const res = await comment(data as CommentData)
      if (res.code === 200) {
        reset()
        setImages([])
        setValue("images", [])
        dispatch(pushComment(res.data!))
      }
    }
    setCommentSubmit(false)
  }

  const comments = useAppSelector(state => state.commentReducer.value)

  return (
    <div
      className='flex flex-col gap-3 items-center justify-between w-full h-full'
    >
      <div className='w-[90%] relative lg:!h-[calc(100vh-300px)] overflow-scroll flex flex-col gap-3'>
        {
          comments && comments.length > 0 ? (
            comments.map(comment => {
              return <CommentItem key={comment._id} data={comment} />
            })
          ) : (
            <span>Không có bình luận</span>
          )
        }
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='w-full flex flex-col gap-3 items-center justify-between absolute bottom-0 bg-white dark:bg-black z-10 shadow-sm'
      >
        <div className='w-[90%]'>
          {
            !!errors.userId && <span className='text-rose-500'>{errors.userId.message}</span>
          }
          {
            images.length > 0 && (
              <div className='flex flex-row gap-3 items-center justify-start h-40px mb-2'>
                {
                  images.map((image, index) => {
                    return (
                      <Image
                        key={index}
                        src={image}
                        height={40}
                        width={40}
                        radius='full'
                        alt='comment image'
                        className='object-cover'
                      />
                    )
                  })
                }
              </div>
            )
          }

          <Textarea
            label="Bình luận"
            labelPlacement="inside"
            placeholder="Nhập bình luận của bạn"
            className="max-w-full shadow-sm"
            {...register("text")}
            isInvalid={!!errors.text}
            errorMessage={errors.text?.message}
          />

          <div className='w-full flex flex-row justify-between items-baseline gap-3'>
            <UploadButton
              appearance={{
                button:
                  "!h-[40px] !rounded-large ut-ready:bg-green-500 ut-uploading:cursor-not-allowed bg-red-500 bg-none after:bg-orange-400",

              }}
              endpoint={'commentImages'}
              onClientUploadComplete={(res) => {
                const fileUrls = [];
                if (res) {
                  for (let i = 0; i < res.length; i++) {
                    fileUrls.push(res?.[i].url);
                  }
                }
                setImages(fileUrls);
                setValue("images", fileUrls)
              }}
              onUploadError={(error: Error) => {
                console.log(error);
              }}
            />

            <Button
              color='success'
              type='submit'
              isDisabled={commentSubmit}
            >
              {commentSubmit &&
                <Spinner size='sm' />
              }
              Đăng
            </Button>
          </div>
        </div>
      </form>

      <Button
        isIconOnly
        radius='full'
        variant='faded'
        size='sm'
        className='absolute hidden lg:!flex top-32 left-0 -translate-x-1/2'
        onPress={() => setOpenCommemt(false)}
      >
        <MdClose className="text-xl" />
      </Button>
    </div>
  )
}

export default Comment