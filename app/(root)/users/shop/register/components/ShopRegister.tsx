"use client"

import React from 'react'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Button, Card, CardBody, CardHeader, Divider, Input, Select, SelectItem, Selection, Spinner } from "@nextui-org/react";
import { useSession } from 'next-auth/react';
import { useDispatch } from 'react-redux';

import DeliveryCard from '@/components/card/DeliveryCard';
import { IUserRegisterShopZodSchema, UserRegisterShopZodSchema } from '@/lib/zodSchema/shop';
import { shopRegister } from '@/actions/shop';
import { ShopType } from "@/lib/constant/ShopType"
import { setSession } from '@/redux/features/session-slice';
import { Session } from 'next-auth';

type IProps = {
  id: string,
  userPhone: string
}

const ShopRegister: React.FC<IProps> = ({ id, userPhone }) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [provinceId, setProvinceId] = React.useState<number>(0)
  const [districtId, setDistrictId] = React.useState<number>(0)
  const [wardId, setWardId] = React.useState<string>("0")
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)
  const [typeValue, setTypeValue] = React.useState<Selection>(new Set([]));

  const { data: session } = useSession()

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<IUserRegisterShopZodSchema>({
    resolver: zodResolver(UserRegisterShopZodSchema),
  });

  const onSubmit = (data: IUserRegisterShopZodSchema) => {
    data.auth = id
    const fetchApi = async () => {
      setIsSubmitting(true)
      const res = await shopRegister({
        data,
        district_id: districtId,
        ward_code: wardId,
      })
      setIsSubmitting(false)

      if (res && res.code === 200) {
        dispatch(setSession({
          ...session,
          user: {
            ...session?.user,
            role: "shop"
          }
        } as Session))
        toast.success(res.message)
        router.push(`/shop/${res.data}`)
      } else {
        toast.error(res.message)
      }
    }
    fetchApi()
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3'>
        <Card shadow='sm'>
          <CardHeader>
            <span>Thông tin cửa hàng</span>
          </CardHeader>

          <Divider />

          <CardBody className='flex flex-col gap-3'>
            <Input
              isRequired
              type="text"
              label="Tên cửa hàng"
              placeholder="Nhập Tên cửa hàng"
              {...register("name")}
              isInvalid={!!errors.name}
              errorMessage={errors.name?.message}
              onChange={e => setValue("name", e.target.value)}
            />

            <Input
              isRequired
              defaultValue={userPhone || ""}
              type="number"
              label="Số điện thoại"
              placeholder="Nhập số điện thoại"
              {...register("phone")}
              isInvalid={!!errors.phone}
              errorMessage={errors.phone?.message}
              onChange={e => setValue("phone", e.target.value)}
            // endContent={
            //   session?.user.phone_verified === false && (
            //     <Tooltip
            //       content={session?.user.phone_verified === false ? "Số điện thoại chưa được xác minh" : "Số điện thoại đã được xác minh"}>
            //       <Button
            //         variant='ghost'
            //         isIconOnly
            //         className={`border-none p-0 ${session?.user.phone_verified === false ? "text-warning-500" : "text-success-500"
            //           }`}
            //         radius='full'
            //         size='sm'
            //       >
            //         {
            //           session?.user.phone_verified === false ? (
            //             <LuBadgeAlert className="text-xl" />
            //           ) : (
            //             <LuBadgeCheck className="text-xl" />
            //           )
            //         }
            //       </Button>
            //     </Tooltip>
            //   )
            // }
            />

            <Select
              isRequired
              label="Chọn loại cửa hàng"
              variant="bordered"
              placeholder="Chọn loại cửa hàng"
              selectedKeys={typeValue}
              className="max-w-full"
              onSelectionChange={setTypeValue}
              {...register("type")}
            >
              {
                ShopType.map(item => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))
              }
            </Select>

            {
              Array.from(typeValue)[0] === "enterprise" && (
                <Input
                  isRequired
                  type="number"
                  label="Mã số thuế"
                  placeholder="Nhập mã số thuế"
                  {...register("tax")}
                  isInvalid={!!errors.tax}
                  errorMessage={errors.tax?.message}
                  onChange={e => setValue("tax", e.target.value)}
                />
              )
            }
          </CardBody>
        </Card>

        <DeliveryCard
          selectionMode='multiple'
          showList={true}
          provinceDefault="Cà Mau"
          label='Địa chỉ lấy hàng và đơn vị vận chuyển'
          registerApartment={{ ...register("apartment") }}
          registerDelivery={{ ...register("delivery") }}
          registerProvince={{ ...register("province") }}
          registerDistrict={{ ...register("district") }}
          registerWard={{ ...register("ward") }}
          getValues={getValues}
          setValue={setValue}
          errors={errors}
          setProvinceId={setProvinceId}
          setDistrictId={setDistrictId}
          setWardId={setWardId}
        />

        <div className='flex flex-row gap-3 items-center justify-end'>
          <Button variant='bordered'>
            Huỷ
          </Button>
          <Button color='success' type='submit' isDisabled={isSubmitting}>
            {isSubmitting && (
              <Spinner size="sm" color="default" />
            )}
            Đăng ký
          </Button>
        </div>
      </form>
    </>
  )
}

export default React.memo(ShopRegister)