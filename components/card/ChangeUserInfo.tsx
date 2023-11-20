"use client"
import React, { useEffect, useState } from 'react'
import { Button, Input, Skeleton, Spinner } from '@nextui-org/react'
import { z } from 'zod';
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux';

import { IShopSettingData, changeShopSetting, getShopDataSetting } from '@/actions/shop'
import { useAppSelector } from '@/redux/store'
import { changeShopName, changeShopPhone } from '@/redux/features/shop-info-slice';
import { changeUserInfo } from '@/actions/user';
import { updateInfo } from '@/redux/features/session-slice';

type IProps = {
  onClose: () => void
}

const UserInfoSchema = z.object({
  phone: z
    .string()
    .refine((value) => /^0\d{9}$/.test(value), {
      message: "Số điện thoại không hợp lệ. Phải có 10 số và bắt đầu bằng số 0",
    })
    .refine((value) => value.trim() !== "", {
      message: "Số điện thoại là bắt buộc",
    }),
  username: z.string().optional(),
  email: z.string().email().optional(),
})

export type IUserInfoSchema = z.infer<typeof UserInfoSchema>

const ChangeUserInfo: React.FC<IProps> = ({ onClose }) => {
  const session = useAppSelector(state => state.sessionReducer.value)
  const dispatch = useDispatch()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<IUserInfoSchema>({
    resolver: zodResolver(UserInfoSchema),
    defaultValues: {
      email: session?.user.email || "",
      phone: session?.user.phone || "",
      username: session?.user.username || ""
    }
  })

  const onSubmit = async (data: IUserInfoSchema) => {
    setIsSubmitting(true)
    const res = await changeUserInfo(session?.user.accessToken!, session?.user._id!, data)
    setIsSubmitting(false)

    if (res.code === 200) {
      dispatch(updateInfo(data))
      toast.success(res.message)
      onClose()
    } else {
      toast.error(res.message)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='flex flex-col gap-3'
    >
      <Input
        isRequired
        isDisabled={!!session?.user.username}
        type="text"
        label="Tên đăng nhập"
        placeholder="Nhập tên đăng nhập"
        defaultValue={session?.user.username || ""}
        className="max-w-full"
        {...register("username")}
        isInvalid={!!errors.username}
        errorMessage={errors.username?.message}
      />

      <Input
        isRequired
        type="number"
        label="Số điện thoại"
        placeholder="Nhập số điện thoại"
        className="max-w-full"
        defaultValue={session?.user.phone || ""}
        {...register("phone")}
        isInvalid={!!errors.phone}
        errorMessage={errors.phone?.message}
      />

      <Input
        isRequired
        type="email"
        label="Email"
        placeholder="Nhập email"
        defaultValue={session?.user.email || ""}
        className="max-w-full"
        {...register("email")}
        isInvalid={!!errors.email}
        errorMessage={errors.email?.message}
      />

      <div className='flex flex-row justify-end items-center gap-3'>
        <Button variant="bordered" onPress={onClose}>
          Đóng
        </Button>
        <Button
          isDisabled={isSubmitting}
          color="success"
          type='submit'
        >
          {
            isSubmitting && <Spinner size='sm' />
          }
          Cập nhật
        </Button>
      </div>
    </form>
  )
}

export default React.memo(ChangeUserInfo)