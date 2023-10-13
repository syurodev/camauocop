"use client"
import OrderDetailModal from '@/components/modal/OrderDetailModal'
import { formatDate } from '@/lib/formatDate'
import { formattedPriceWithUnit } from '@/lib/formattedPriceWithUnit'
import { Avatar, Card, Skeleton, useDisclosure } from '@nextui-org/react'
import React from 'react'

type IProps = {
  isLoading: boolean
  orders: IOrders[] | [],
  role: string,
  accessToken: string
}
const Orders: React.FC<IProps> = ({ isLoading, orders, role, accessToken }) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const [orderSelected, setOrderSelected] = React.useState<string>("")

  const getColorForOrderStatus = (orderStatus: string) => {
    if (orderStatus === 'pending') {
      return 'warning';
    } else if (orderStatus === 'canceled') {
      return 'danger';
    } else {
      return 'success';
    }
  };

  return (
    <>
      <div className="mt-5 grid items-center sm:grid-cols-2 grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4 xl:gap-5">
        {
          isLoading ? (
            Array.from({ length: 5 }).map((_, index) => {
              return (
                <Card key={index} shadow='sm' className='p-3'>
                  <div className="max-w-[300px] w-full flex items-center gap-3">
                    <div>
                      <Skeleton className="flex rounded-full w-[4.5rem] h-[4.5rem]" />
                    </div>
                    <div className="w-full flex flex-col gap-2">
                      <Skeleton className="h-3 w-3/5 rounded-lg" />
                      <Skeleton className="h-3 w-4/5 rounded-lg" />
                      <Skeleton className="h-3 w-4/5 rounded-lg" />
                    </div>
                  </div>
                </Card>
              )
            }
            )
          ) : orders && orders.length > 0 ? (
            orders.map(order => {
              return (
                <Card
                  key={order._id}
                  isPressable
                  shadow='sm'
                  className={`p-2 relative`}
                  onPress={() => {
                    setOrderSelected(order._id)
                    onOpen()
                  }}
                >
                  <span
                    className={`absolute font-bold text-sm bottom-1 right-2 opacity-20 
                  text-${getColorForOrderStatus(order.orderStatus)} uppercase pointer-events-none select-none`}>
                    {order.orderStatus}
                  </span>
                  <div className="max-w-[300px] w-full flex items-center gap-3">
                    <div>
                      <Avatar
                        src={order.productImage}
                        alt="product image"
                        className="w-[4.5rem] h-[4.5rem]"
                      />
                    </div>
                    <div className="w-[65%] flex flex-col justify-start items-start overflow-hidden line-clamp-1">
                      <p className='font-medium w-full line-clamp-1'>{order.buyerId.username || order.buyerId.email}</p>
                      <p className='text-primary'>{formattedPriceWithUnit(order.totalAmount)}</p>
                      <p className='text-sm'>{formatDate(order?.orderDateConvert!)}</p>
                    </div>
                  </div>
                </Card>
              )
            })
          ) : (
            <>Không có đơn hàng</>
          )
        }
      </div>
      <OrderDetailModal
        isOpenOrderDetailModal={isOpen}
        onCloseOrderDetailModal={onClose}
        onOpenChangeOrderDetailModal={onOpenChange}
        id={orderSelected}
        role={role}
        accessToken={accessToken}
      />
    </>
  )
}

export default Orders