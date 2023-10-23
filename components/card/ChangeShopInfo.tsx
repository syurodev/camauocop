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

type IProps = {
  onClose: () => void
}

const ChangeShopInfo: React.FC<IProps> = ({ onClose }) => {
  const session = useAppSelector(state => state.sessionReducer.value)
  const dispatch = useDispatch()
  const [shopSettingData, setShopSettingData] = useState<IShopSettingData>({
    phone: "",
    name: "",
    type: "personal",
    tax: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [enterprise, setEnterprise] = useState<boolean>(false)

  const ShopSettingSchema = z.object({
    phone: z
      .string()
      .refine((value) => /^0\d{9}$/.test(value), {
        message: "Số điện thoại không hợp lệ. Phải có 10 số và bắt đầu bằng số 0",
      })
      .refine((value) => value.trim() !== "", {
        message: "Số điện thoại là bắt buộc",
      }),
    name: z.string().nonempty("Vui lòng nhập tên cửa hàng"),
    tax: z
      .string()
      .refine((value) => {
        if (value) {
          return /^\d{10}$/.test(value);
        }
        return true; // Bỏ qua kiểm tra nếu trường tax không được nhập
      }, {
        message: "Mã số thuế phải có 10 chữ số",
      })
      .optional(),
    type: z.string().optional(),
  })

  type IShopSettingSchema = z.infer<typeof ShopSettingSchema>


  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<IShopSettingSchema>({
    resolver: zodResolver(ShopSettingSchema),
  })

  useEffect(() => {
    const fetchApi = async () => {
      setIsLoading(true)
      const res = await getShopDataSetting(session?.user.accessToken!, session?.user.shopId!)
      if (res.code === 200) {
        setEnterprise(res.data?.type === 'enterprise' ? true : false)
        setShopSettingData(res.data!)
        setValue("name", res.data?.name!)
        setValue("phone", res.data?.phone!)
        setValue("tax", res.data?.tax || "")
        setValue("type", res.data?.type!)
      } else {
        toast.error(res.message)
        onClose()
      }
      setIsLoading(false)
    }

    if (session) {
      fetchApi()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  const onSubmit = async (data: IShopSettingSchema) => {

    if (enterprise) {
      data.type = 'enterprise';
    } else {
      data.type = 'personal';
    }
    setIsSubmitting(true)
    const res = await changeShopSetting(session?.user.accessToken!, session?.user.shopId!, session?.user._id!, {
      name: data.name,
      phone: data.phone,
      tax: data.tax || "",
      type: data.type as ShopType
    })
    setIsSubmitting(false)

    if (res.code === 200) {
      dispatch(changeShopPhone({
        phone: data.phone,
      }))
      dispatch(changeShopName({
        name: data.name,
      }))
      toast.success(res.message)
    } else {
      toast.error(res.message)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='flex flex-col gap-3'
    >
      {
        isLoading ? (
          <Skeleton className="h-[56px] w-full rounded-lg" />
        ) : (
          <Input
            isRequired
            type="text"
            label="Tên cửa hàng"
            className="max-w-full"
            {...register("name")}
            isInvalid={!!errors.name}
            errorMessage={errors.name?.message}
            value={shopSettingData?.name}
            onChange={(e) => {
              setShopSettingData((prev) => (
                {
                  ...prev,
                  name: e.target.value
                }
              ))
              setValue("name", e.target.value)
            }}
          />
        )
      }

      {
        isLoading ? (
          <Skeleton className="h-[56px] w-full rounded-lg" />
        ) : (
          <Input
            isRequired
            type="number"
            label="Số điện thoại"
            className="max-w-full"
            {...register("phone")}
            isInvalid={!!errors.phone}
            errorMessage={errors.phone?.message}
            value={shopSettingData?.phone}
            onChange={(e) => {
              setShopSettingData((prev) => (
                {
                  ...prev,
                  phone: e.target.value
                }
              ))
              setValue("phone", e.target.value)
            }}
          />
        )
      }

      {
        isLoading ? (
          <Skeleton className="h-[40px] w-full rounded-lg" />
        ) :
          shopSettingData.type === 'personal' ? (
            <Button variant='flat' color='success' onPress={() => {
              setEnterprise(!enterprise)
              setShopSettingData((prev) => (
                {
                  ...prev,
                  tax: ""
                }
              ))
              setValue("tax", "")
            }}>
              {enterprise ? "Huỷ đổi tài khoản doanh nghiệp" : "Chuyển đổi tài khoản doanh nghiệp"}
            </Button>
          ) : <></>
      }

      {
        enterprise && (
          <Input
            isRequired
            type="number"
            label="Mã số thuế"
            minLength={10}
            maxLength={10}
            className="max-w-full"
            {...register("tax")}
            isInvalid={!!errors.tax}
            errorMessage={errors.tax?.message}
            value={shopSettingData?.tax}
            onChange={(e) => {
              setShopSettingData((prev) => (
                {
                  ...prev,
                  tax: e.target.value
                }
              ))
              setValue("tax", e.target.value)
            }}
          />
        )
      }

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

export default React.memo(ChangeShopInfo)