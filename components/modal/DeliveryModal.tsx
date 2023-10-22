"use client"
import React from 'react'
import { Button, Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Input, Spinner } from '@nextui-org/react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';

import { approveOrder } from '@/actions/order';
import { DeliveryOrderSchema, IDeliveryOrderSchema } from '@/lib/zodSchema/order';
import { zodResolver } from '@hookform/resolvers/zod';
import { GHNRequireNote, paymentType } from '@/lib/constant/GHNConstants';
import { calculateTotalWeight } from '@/lib/calculateTotalWeight';
import { useAppSelector } from '@/redux/store';
import { updateOrderStatus } from '@/redux/features/orders.slice';

type IProps = {
  isOpenDeliveryModal: boolean;
  onCloseDeliveryModal: () => void;
  onOpenChangeDeliveryModal: () => void;
  onCloseOrderDetailModal: () => void;
  orderDetail: IOrderDetail,
  GHNCodeData: GHNCodeResponse,
  totalWidth: number,
  totalHeight: number,
  totalLength: number,
  setTotalWidth: React.Dispatch<React.SetStateAction<number>>,
  setTotalHeight: React.Dispatch<React.SetStateAction<number>>,
  setTotalLength: React.Dispatch<React.SetStateAction<number>>,
}

type Item = {
  name: string;
  quantity: number;
}

const DeliveryModal: React.FC<IProps> = ({
  isOpenDeliveryModal,
  onCloseDeliveryModal,
  onOpenChangeDeliveryModal,
  onCloseOrderDetailModal,
  orderDetail,
  GHNCodeData,
  totalWidth,
  totalHeight,
  totalLength,
  setTotalWidth,
  setTotalHeight,
  setTotalLength,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<IDeliveryOrderSchema>({
    resolver: zodResolver(DeliveryOrderSchema),
  })

  const dispatch = useDispatch()
  const session = useAppSelector(state => state.sessionReducer.value)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [paymentTypeSelected, setPaymentTypeSelected] = React.useState(new Set(["1"]))
  const [requiredNoteSelected, setRequiredNoteSelected] = React.useState(new Set(["CHOXEMHANGKHONGTHU"]))

  const onSubmit = async (data: IDeliveryOrderSchema) => {
    // setIsLoading(true)
    data.to_name = orderDetail?.buyerId!.username || orderDetail?.buyerId!.email || ""
    data.to_address = `${orderDetail.apartment} - ${orderDetail.ward} - ${orderDetail.district} - ${orderDetail.province}`
    data.service_type_id = 2
    data.to_district_name = orderDetail.district
    data.to_ward_name = orderDetail.ward
    data.to_ward_code = GHNCodeData.data?.wardCode!
    data.to_phone = orderDetail.buyerId.phone!
    const totalWeight: number = calculateTotalWeight(orderDetail)
    data.weight = +totalWeight
    const transformedArray: Item[] = orderDetail.products.map(product => {
      let name = product.productSnapshot.name;
      let quantity = product.quantity || 1;

      return {
        name,
        quantity,
      }
    })
    data.Items = transformedArray

    const res = await approveOrder(session?.user.accessToken!, orderDetail._id, data, orderDetail.shopId.shop_id.GHN!)
    setIsLoading(false)
    if (res.code === 200) {
      toast.success(res.message)
      dispatch(updateOrderStatus({
        orderId: orderDetail._id,
        newStatus: "processed",
      }))
      onCloseDeliveryModal()
      onCloseOrderDetailModal()
    } else {
      toast.error(res.message)
    }
  }

  return (
    <section>
      <Modal
        isOpen={isOpenDeliveryModal}
        onOpenChange={onOpenChangeDeliveryModal}
        scrollBehavior="outside"
        size="5xl"
        placement="bottom"
        backdrop='blur'
        isKeyboardDismissDisabled
        classNames={{
          base: "!max-w-[98%] !h-[90%] mx-2 !mb-0 !absolute !bottom-0 !rounded-b-none !overflow-auto"
        }}
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.2,
                ease: "easeOut",
              },
            },
            exit: {
              y: 20,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: "easeIn",
              },
            },
          }
        }}
      >
        <ModalContent>
          {(onCloseDeliveryModal) => (
            <>
              <form onSubmit={handleSubmit(onSubmit)}>
                <ModalHeader>
                  Xác nhận đơn hàng
                </ModalHeader>
                <Divider />
                <ModalBody>
                  <p>Người nhận: {orderDetail?.buyerId!.username || orderDetail?.buyerId!.email || ""}</p>
                  <p>Số điện thoại người nhận: {orderDetail.buyerId.phone || ""}</p>
                  <p>Địa chỉ giao hàng: {`${orderDetail.apartment} - ${orderDetail.ward} - ${orderDetail.district} - ${orderDetail.province}`}</p>
                  <p>Khối lượng đơn hàng: {calculateTotalWeight(orderDetail)}gram</p>

                  <Select
                    isRequired
                    items={GHNRequireNote}
                    label="Ghi chú bắt buộc"
                    placeholder="Vui lòng chọn ghi chí"
                    className="max-w-full"
                    {...register("required_note")}
                    isInvalid={!!errors.required_note}
                    errorMessage={errors.required_note?.message}
                    selectedKeys={requiredNoteSelected}
                    onSelectionChange={(e) => {
                      const value = Array.from(e)[0]
                      setRequiredNoteSelected(new Set([value.toString()]))
                    }}
                  >
                    {(item) => <SelectItem key={item.value}>{item.label}</SelectItem>}
                  </Select>

                  <Select
                    isRequired
                    items={paymentType}
                    label="Người thanh toán phí dịch vụ"
                    placeholder="Vui lòng chọn người thanh toán phí dịch vụ"
                    className="max-w-full"
                    {...register("payment_type_id")}
                    isInvalid={!!errors.payment_type_id}
                    errorMessage={errors?.payment_type_id?.message || ""}
                    selectedKeys={paymentTypeSelected}
                    onSelectionChange={(e) => {
                      const value = Array.from(e)[0]
                      setPaymentTypeSelected(new Set([value.toString()]))
                    }}
                  >
                    {(item) => <SelectItem key={item.value}>{item.label}</SelectItem>}
                  </Select>

                  <Input
                    isRequired
                    type="number"
                    label="Chiều rộng của đơn hàng (cm)"
                    max={150}
                    placeholder='Tối đa 150cm'
                    className="max-w-full"
                    {...register("width")}
                    isInvalid={!!errors.width}
                    errorMessage={errors.width?.message}
                    value={totalWidth.toString() || "0"}
                    onChange={e => {
                      setTotalWidth(+e.target.value)
                      setValue("width", +e.target.value)
                    }}
                  />

                  <Input
                    isRequired
                    type="number"
                    label="Chiều cao của đơn hàng (cm)"
                    max={150}
                    placeholder='Tối đa 150cm'
                    className="max-w-full"
                    {...register("height")}
                    isInvalid={!!errors.height}
                    errorMessage={errors.height?.message}
                    value={totalHeight.toString() || "0"}
                    onChange={e => {
                      setTotalHeight(+e.target.value)
                      setValue("height", +e.target.value)
                    }}
                  />

                  <Input
                    isRequired
                    type="number"
                    label="Chiều dài của đơn hàng (cm)"
                    max={150}
                    placeholder='Tối đa 150cm'
                    className="max-w-full"
                    {...register("length")}
                    isInvalid={!!errors.length}
                    errorMessage={errors.length?.message}
                    value={totalLength.toString() || "0"}
                    onChange={e => {
                      setTotalLength(+e.target.value)
                      setValue("length", +e.target.value)
                    }}
                  />
                </ModalBody>
                <Divider />
                <ModalFooter className='flex flex-row gap-3 justify-end items-center'>
                  <Button variant='bordered' onPress={onCloseDeliveryModal}>Đóng</Button>

                  <Button
                    isDisabled={isLoading}
                    color='success'
                    type='submit'
                  >
                    {
                      isLoading && (
                        <Spinner size="sm" color="default" />
                      )
                    }
                    Xác nhận
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </section>
  )
}

export default React.memo(DeliveryModal)