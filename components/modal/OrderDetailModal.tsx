"use client"
import React from 'react'
import { Avatar, Button, Card, CardBody, CardFooter, CardHeader, Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Skeleton, useDisclosure } from '@nextui-org/react'
import toast from 'react-hot-toast';
import { BsTelephone } from "react-icons/bs"
import Link from 'next/link';
import { TbTruckDelivery, TbMoneybag } from "react-icons/tb"
import { CiMoneyBill } from "react-icons/ci"

import SlideShow from '../elements/SlideShow';
import { formattedPriceWithUnit } from '@/lib/formattedPriceWithUnit';
import { getGHNCode } from '@/actions/address';
import { getGHNServiceFee } from '@/actions/delivery';
import { convertWeight } from '@/lib/convertWeight';
import { getOrderDetail } from '@/actions/order';
import DeliveryModal from './DeliveryModal';

type IProps = {
  isOpenOrderDetailModal: boolean;
  onCloseOrderDetailModal: () => void;
  onOpenChangeOrderDetailModal: () => void;
  id: string,
  role: string,
  accessToken: string
}

const OrderDetailModal: React.FC<IProps> = ({ isOpenOrderDetailModal, onCloseOrderDetailModal, onOpenChangeOrderDetailModal, id, role, accessToken }) => {
  const [orderDetail, setOrderDetail] = React.useState<IOrderDetail | null>(null)
  const [serviceFee, setServiceFee] = React.useState<number>(0)
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [GHNCodeData, setGHNCodeData] = React.useState<GHNCodeResponse>()
  const [isDeliveryLoading, setIsDeliveryLoading] = React.useState<boolean>(true)
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const [totalWidth, setTotalWidth] = React.useState<number>(0)
  const [totalHeight, setTotalHeight] = React.useState<number>(0)
  const [totalLength, setTotalLength] = React.useState<number>(0)

  React.useEffect(() => {
    const fetctData = async () => {
      setIsLoading(true)
      setIsDeliveryLoading(true)
      const res: IOrderDetailResponse = await getOrderDetail(id)
      setIsLoading(false)

      if (res.code === 500) {
        toast.error(res.message!)
        onCloseOrderDetailModal()
      }

      if (res.code === 400) {
        toast.error(res.message!)
        onCloseOrderDetailModal()
      }

      if (res.code === 200) {
        setOrderDetail(res.data)
        const GHNCode: GHNCodeResponse = await getGHNCode(res.data?.province!, res.data?.district!, res.data?.ward!)

        if (GHNCode.code === 200) {
          setGHNCodeData(GHNCode)
          let totalWeight = 0
          const transformedArray = res.data?.products.map(product => {
            let name = product.productSnapshot.name;
            let quantity = product.quantity || 1;
            let weight = 0;
            let length = product.length || 0;
            let width = product.width || 0;
            let height = product.height || 0;
            let totalWidthTemp = 0;
            let totalHeightTemp = 0;
            let totalLengthTemp = 0;
            totalWidthTemp += product?.width * product.quantity || 0
            totalHeightTemp += product?.height * product.quantity || 0
            totalLengthTemp += product?.length * product.quantity || 0
            setTotalWidth(totalWidthTemp)
            setTotalHeight(totalHeightTemp)
            setTotalLength(totalLengthTemp)

            if (product.unit === "gram") {
              weight = product.weight;
              totalWeight += product.weight * product.quantity
            } else {
              const temp = convertWeight(product.weight, product.unit as WeightUnit, "gram")
              weight = temp
              totalWeight += temp * product.quantity
            }
            return {
              name,
              quantity,
              weight,
              length,
              width,
              height,
            }
          })

          const deliveryFee: GHNApiServiceFee = await getGHNServiceFee({
            to_district_id: GHNCode.data?.districtId!,
            to_ward_code: GHNCode.data?.wardCode!,
            shop_id: res.data?.shopId.shop_id.GHN!,
            items: transformedArray || [],
            weight: totalWeight
          })

          if (deliveryFee && deliveryFee.code === 200) {
            setServiceFee(deliveryFee.data?.total || 0)
            setIsDeliveryLoading(false)
          } else {
            toast.error(deliveryFee.message)
            setIsDeliveryLoading(false)
            onCloseOrderDetailModal()
          }
        } else {
          toast.error(GHNCode.message)
          onCloseOrderDetailModal()
        }
      } else {
        toast.error(res.message!)
        onCloseOrderDetailModal()
      }
    }

    if (isOpenOrderDetailModal && id) {
      fetctData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenOrderDetailModal, id])

  return (
    <section>
      <Modal
        isOpen={isOpenOrderDetailModal}
        onOpenChange={onOpenChangeOrderDetailModal}
        scrollBehavior="outside"
        size="5xl"
        placement="bottom"
        isKeyboardDismissDisabled
        classNames={{
          base: "!max-w-[98%] !h-[95%] mx-2 !mb-0 !absolute !bottom-0 !rounded-b-none !overflow-auto"
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
          {(onCloseOrderDetailModal) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Chi tiết đơn hàng
              </ModalHeader>

              <ModalBody>
                <Card shadow='sm' className='p-2'>
                  <CardHeader>
                    {
                      role === "shop" ? "Thông tin người mua" : "Thông tin người bán"
                    }
                  </CardHeader>

                  <Divider />

                  <CardBody className='flex flex-row gap-2'>
                    {
                      isLoading ? (
                        <Skeleton className="flex rounded-full w-12 h-12" />
                      ) : (
                        <Avatar
                          src={role === "shop" ? orderDetail?.buyerId.avatar : orderDetail?.shopId.auth.avatar}
                          className='w-12 h-12'
                        />
                      )
                    }
                    <div className='flex flex-col w-[80%]'>
                      {
                        isLoading ? (
                          <Skeleton className="h-4 w-3/5 rounded-lg mb-2" />
                        ) : (
                          <p>
                            {role === "shop" ? orderDetail?.buyerId.username || orderDetail?.buyerId.email
                              : orderDetail?.shopId.name}
                          </p>
                        )
                      }
                      <div className='flex flex-row items-center gap-1 w-[80%]'>
                        <BsTelephone />
                        {
                          isLoading ? (
                            <Skeleton className="h-4 w-4/5 rounded-lg" />
                          ) : (
                            <p>{role === "shop" ? orderDetail?.buyerId.phone || "Không có" : orderDetail?.shopId.auth.phone || "Không có"}</p>
                          )
                        }
                      </div>
                    </div>
                  </CardBody>
                </Card>

                <Card shadow='sm' className='p-2'>
                  <CardHeader>
                    Thông tin đơn hàng
                  </CardHeader>

                  <Divider />

                  <CardBody className='flex'>
                    <h3 className='mb-3'>THÔNG TIN HÀNG HOÁ</h3>
                    {
                      isLoading ? (
                        <div className='flex flex-row gap-3'>
                          <div className='w-1/2'>
                            <Skeleton className="flex rounded-lg h-[120px] w-full" />
                          </div>

                          <Divider orientation="vertical" />

                          <div className='w-1/2 flex flex-col gap-2'>
                            <Skeleton className="h-7 w-full rounded-lg" />
                            <Skeleton className="h-4 w-1/2 rounded-lg" />
                            <div className='w-full ps-2 flex flex-col gap-2'>
                              <Skeleton className="h-4 w-2/3 rounded-lg" />
                              <Skeleton className="h-4 w-2/3 rounded-lg" />
                              <Skeleton className="h-4 w-2/3 rounded-lg bg-primary" />
                            </div>
                          </div>
                        </div>
                      ) : orderDetail && orderDetail.products.map(product => {
                        return (
                          <div key={product.productId} className='flex flex-row gap-3'>
                            <div className='w-1/2'>
                              <SlideShow images={product.productSnapshot.images} w='w-full' h='h-[120px]' />
                            </div>
                            <Divider orientation="vertical" />
                            <div className='w-1/2'>
                              <Link
                                href={`/products/product/${product.productId}`}
                                className='font-semibold text-lg uppercase'
                              >
                                {product.productSnapshot.name}
                              </Link>
                              {
                                <>
                                  <h4>
                                    {
                                      product.retail ? "Mua lẻ" : "Mua gói"
                                    }
                                  </h4>
                                  <div className='ps-2'>
                                    <p>
                                      Khối lượng: {product.weight}{product.unit}
                                    </p>
                                    {
                                      product.retail === false && <p>Số lượng: {product.quantity} gói</p>
                                    }
                                    <p>
                                      Giá tiền:
                                      <span className='text-primary font-semibold'> {product.retail ? formattedPriceWithUnit(product.price) : formattedPriceWithUnit(product.price * product.quantity)}
                                      </span>
                                    </p>
                                  </div>
                                </>

                              }
                            </div>
                          </div>
                        )
                      })
                    }

                    {
                      isDeliveryLoading ? (
                        <>
                          <h3 className='mt-4 mb-2'>THÔNG TIN VẬN CHUYỂN</h3>

                          <div className='flex flex-col gap-2'>
                            <div className='flex w-full flex-row items-center gap-1'>
                              <TbTruckDelivery />
                              <Skeleton className="h-4 w-full rounded-lg" />
                            </div>

                            <div className='w-full flex flex-row items-center gap-1'>
                              <CiMoneyBill />
                              <Skeleton className="h-4 w-1/4 rounded-lg bg-primary" />
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <h3 className='mt-4 mb-2'>THÔNG TIN VẬN CHUYỂN</h3>
                          <div>
                            <div className='flex flex-row items-center gap-1'>
                              <TbTruckDelivery />
                              <span>Giao hàng đến: {orderDetail!.apartment || ""} - {orderDetail!.ward || ""} - {orderDetail!.district || ""} - {orderDetail!.province || ""}</span>
                            </div>

                            <div className='flex flex-row items-center gap-1'>
                              <CiMoneyBill />
                              <span className='text-primary font-semibold'>{formattedPriceWithUnit(serviceFee)}</span>
                            </div>
                          </div>
                        </>
                      )
                    }
                  </CardBody>

                  <Divider />

                  <CardFooter className='flex flex-row gap-2'>
                    <TbMoneybag />
                    <span>Tổng tiền:</span>
                    {
                      isDeliveryLoading ? (
                        <Skeleton className="h-4 w-1/4 rounded-lg bg-primary" />
                      ) : (
                        <span className='text-primary font-semibold'>{formattedPriceWithUnit(orderDetail?.totalAmount)}</span>
                      )
                    }
                  </CardFooter>
                </Card>
              </ModalBody>

              <ModalFooter className='flex flex-row items-center justify-end gap-3'>
                <Button variant='bordered' onPress={onCloseOrderDetailModal}>
                  Đóng
                </Button>

                <Button color='danger'>
                  {
                    role === "shop" ? (
                      orderDetail?.orderStatus !== "pending" ? "Huỷ đơn" : "Từ chối"
                    ) : "Huỷ"
                  }
                </Button>

                {
                  role === "shop" && orderDetail?.orderStatus === "pending" && (
                    <Button
                      color='success'
                      onPress={() => onOpen()}
                    >
                      Xác nhận
                    </Button>
                  )
                }
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {
        role === "shop" && orderDetail && GHNCodeData && <DeliveryModal
          isOpenDeliveryModal={isOpen}
          onCloseDeliveryModal={onClose}
          onOpenChangeDeliveryModal={onOpenChange}
          id={id}
          accessToken={accessToken}
          orderDetail={orderDetail}
          GHNCodeData={GHNCodeData}
          totalWidth={totalWidth}
          totalHeight={totalHeight}
          totalLength={totalLength}
          setTotalWidth={setTotalWidth}
          setTotalHeight={setTotalHeight}
          setTotalLength={setTotalLength}
        />
      }
    </section>
  )
}

export default React.memo(OrderDetailModal)