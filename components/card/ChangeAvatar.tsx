"use client"

import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import AvatarUpload from '../elements/AvatarUpload'
import { useAppSelector } from '@/redux/store'
import { Button, Spinner } from '@nextui-org/react';
import { changeShopImage } from '@/actions/shop';
import toast from 'react-hot-toast';
import { changeShopAvatar } from '@/redux/features/shop-info-slice'

type IProps = {
  onClose: () => void
}

const ChangeAvatar: React.FC<IProps> = ({ onClose }) => {
  const [shopAvatar, setShopAvatar] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const dispatch = useDispatch()
  const shopInfo = useAppSelector(state => state.shopInfoReducer.value)
  const session = useAppSelector(state => state.sessionReducer.value)

  const onSubmit = async () => {
    setIsSubmitting(true)
    const res = await changeShopImage(session?.user.shopId!, session?.user.accessToken!, shopAvatar)
    setIsSubmitting(false)

    if (res.code === 200) {
      toast.success(res.message)
      dispatch(changeShopAvatar({
        image: shopAvatar
      }))
    } else {
      toast.error(res.message)
    }
  }

  return (
    <div className='flex flex-col gap-3'>
      <AvatarUpload avatar={shopAvatar} setAvatar={setShopAvatar} />

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