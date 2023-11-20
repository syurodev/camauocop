"use client"

import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import AvatarUpload from '../elements/AvatarUpload'
import { useAppSelector } from '@/redux/store'
import { Button, Spinner } from '@nextui-org/react';
import { changeShopImage } from '@/actions/shop';
import toast from 'react-hot-toast';
import { changeShopAvatar } from '@/redux/features/shop-info-slice'
import { changeUserAvatar } from '@/actions/user'
import { updateAvatar } from '@/redux/features/session-slice'

type IProps = {
  onClose: () => void
  role: "shop" | "user"
}

const ChangeAvatar: React.FC<IProps> = ({ onClose, role }) => {
  const session = useAppSelector(state => state.sessionReducer.value)
  const [avatar, setAvatar] = useState<string>(session?.user.image || "")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const dispatch = useDispatch()

  const onSubmit = async () => {
    if (role === "shop") {
      setIsSubmitting(true)
      const res = await changeShopImage(session?.user.shopId!, session?.user.accessToken!, avatar)
      setIsSubmitting(false)
      if (res.code === 200) {
        toast.success(res.message)
        dispatch(changeShopAvatar({
          image: avatar
        }))
        onClose()
      } else {
        toast.error(res.message)
      }
    } else if (role === "user") {
      setIsSubmitting(true)
      const res = await changeUserAvatar(session?.user._id!, session?.user.accessToken!, avatar)
      setIsSubmitting(false)
      if (res.code === 200) {
        toast.success(res.message)
        dispatch(updateAvatar({
          image: avatar
        }))
        onClose()
      } else {
        toast.error(res.message)
      }
    }
  }

  return (
    <div className='flex flex-col gap-3'>
      <AvatarUpload avatar={avatar} setAvatar={setAvatar} />

      <div className='flex flex-row justify-end items-center gap-3'>
        <Button variant="bordered" onPress={onClose}>
          Đóng
        </Button>
        <Button
          isDisabled={isSubmitting}
          color="success"
          onPress={onSubmit}
        >
          {
            isSubmitting && <Spinner size='sm' />
          }
          Cập nhật
        </Button>
      </div>
    </div>
  )
}

export default React.memo(ChangeAvatar)