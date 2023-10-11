"use client"

import React from 'react'
import { Button, Card, CardBody, CardHeader, Divider, Input, Spinner, Tooltip } from "@nextui-org/react";
import { useSession } from "next-auth/react";
// import { LuBadgeAlert, LuBadgeCheck } from "react-icons/lu"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import DeliveryCard from '@/components/card/DeliveryCard';
import { IUserRegisterShopZodSchema, UserRegisterShopZodSchema } from '@/lib/zodSchema/shop';
import { shopRegister } from '@/actions/shop';


const ShopRegisterPage: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter()
  const [provinceId, setProvinceId] = React.useState<number>(0)
  const [districtId, setDistrictId] = React.useState<number>(0)
  const [wardId, setWardId] = React.useState<string>("0")
  const [next, setNext] = React.useState<boolean>(false)
  const [code, setCode] = React.useState<number>(0)

  React.useEffect(() => {
    if (!!session) {
      router.push("/login")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<IUserRegisterShopZodSchema>({
    resolver: zodResolver(UserRegisterShopZodSchema),
  });

  const onSubmit = (data: IUserRegisterShopZodSchema) => {
    data.auth = session?.user._id
    const fetchApi = async () => {
      if (code === 4011) {
        setNext(true)
      }
      const res = await shopRegister({
        data,
        district_id: districtId,
        ward_code: wardId,
        next
      })

      if (res && res.code === 4011) {
        setCode(4011)
        toast.error(`${res.message} Nếu muốn tiếp tục hãy nhấn Đăng ký một lần nữa.
         Lưu ý: khi tiếp tục số điện thoại của bạn sẻ bị thay đổi`)
      }
      if (res && res.code === 500) {
        toast.error(res.message)
      }

      if (res && res.code === 200) {
        toast.success(res.message)
        router.push("/")
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
              isDisabled={!session?.user}
              defaultValue={session?.user.phone || ""}
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
          </CardBody>
        </Card>

        <DeliveryCard
          selectionMode='multiple'
          showList={true}
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

export default ShopRegisterPage