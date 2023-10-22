"use client"

import React, { useEffect, useState } from 'react'
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Spinner } from '@nextui-org/react';
import { Session } from 'next-auth';
import { useDispatch } from 'react-redux';

import { getShopSettingData, updateShopSetting } from '@/actions/admin';
import { useAppSelector } from '@/redux/store';
import toast from 'react-hot-toast';
import { ShopType } from '@/lib/constant/ShopType';
import { useForm } from 'react-hook-form';
import { AdminShopSettingSchema, IAdminShopSettingSchema } from '@/lib/zodSchema/adminShopSetting';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateShop } from '@/redux/features/shops-slice';

type IProps = {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: () => void;
  shopId: string,
}

const ShopStatus = [
  {
    value: "active",
    label: "Hoạt động"
  },
  {
    value: "block",
    label: "Bị khoá"
  }
]

const AdminSettingShop: React.FC<IProps> = ({
  isOpen,
  onClose,
  onOpenChange,
  shopId,
}) => {
  const session: Session | null = useAppSelector(state => state.sessionReducer.value)
  const [shopData, setShopData] = useState<boolean>(false)
  const [shopType, setShopType] = useState(new Set([""]))
  const [shopFee, setShopFee] = useState(0)
  const [shopTax, setShopTax] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [shopStatus, setShopStatus] = useState(new Set([""]))
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<IAdminShopSettingSchema>({
    resolver: zodResolver(AdminShopSettingSchema),

  })

  //GET SHOP INFO
  useEffect(() => {
    const fetchApi = async () => {
      const res = await getShopSettingData(shopId, session?.user.accessToken!);

      if (res.code === 200) {
        setShopData(true)
        setShopType(new Set([res.data?.type!]))
        setShopFee(res.data?.fee!)
        setShopTax(res.data?.tax!)
        setShopStatus(new Set([res.data?.status!]))
        setValue("fee", res.data?.fee!)
        setValue("status", res.data?.status!)
        setValue("type", res.data?.type!)
        setValue("tax", res.data?.tax!)
      } else {
        toast.error(res.message)
        onClose()
      }
    }

    if (session) {
      fetchApi()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSubmit = async (data: IAdminShopSettingSchema) => {
    setIsSubmitting(true)
    const res = await updateShopSetting(
      shopId,
      session?.user.accessToken!,
      data as {
        fee: number,
        status: ShopStatus,
        type: ShopType,
        tax: string
      }
    )
    setIsSubmitting(false)
    if (res.code === 200) {
      toast.success(res.message)
      dispatch(updateShop({
        shopId: shopId,
        fee: data.fee,
        status: data.status as ShopStatus,
        type: data.type as ShopType
      }))
      onClose()
    } else {
      toast.error(res.message)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      backdrop="blur"
    >
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader className="flex flex-col gap-1">
              Cài đặt cửa hàng
            </ModalHeader>
            <ModalBody>
              {
                shopData && (
                  <>
                    <Input
                      isRequired
                      type="number"
                      label="Phí dịch vụ"
                      max={100}
                      description="Phí thu trên mỗi đơn hàng thành công"
                      className="max-w-full"
                      endContent={
                        <span className='pointer-events-none select-none'>%</span>
                      }
                      {...register("fee")}
                      isInvalid={!!errors.fee}
                      errorMessage={errors.fee?.message}
                      value={shopFee.toString()}
                      onChange={(e) => {
                        setShopFee(+e.target.value)
                        setValue("fee", +e.target.value)
                      }}
                    />

                    <Select
                      isRequired
                      label="Chọn trạng thái cửa hàng"
                      className="max-w-full"
                      isInvalid={!!errors.status}
                      errorMessage={errors.status?.message}
                      selectedKeys={shopStatus}
                      onSelectionChange={(e) => {
                        const value = Array.from(e)[0] as ShopStatus;
                        setShopStatus(new Set([value]))
                        setValue("status", value)
                      }}
                    >
                      {ShopStatus.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </Select>

                    <Select
                      isRequired
                      label="Chọn loại cửa hàng"
                      className="max-w-full"
                      isInvalid={!!errors.type}
                      errorMessage={errors.type?.message}
                      selectedKeys={shopType}
                      onSelectionChange={(e) => {
                        const value = Array.from(e)[0] as ShopType
                        if (value === "personal") {
                          setShopTax("")
                          setValue("tax", "")
                        }
                        setShopType(new Set([value]))
                        setValue("type", value)
                      }}
                    >
                      {ShopType.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </Select>

                    {
                      Array.from(shopType)[0] === "enterprise" ? (
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
                          value={shopTax}
                          onChange={(e) => {
                            setShopTax(e.target.value)
                            setValue("tax", e.target.value)
                          }}
                        />
                      ) : (
                        <></>
                      )
                    }

                  </>
                )
              }
            </ModalBody>
            <ModalFooter>
              <Button variant="bordered" onPress={onClose}>
                Đóng
              </Button>
              <Button
                type='submit'
                isDisabled={isSubmitting}
                color={Array.from(shopStatus)[0] === "block" ? "danger" : "primary"}
              >
                {
                  isSubmitting && <Spinner size='sm' />
                }
                Cập nhật
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  )
}

export default React.memo(AdminSettingShop)