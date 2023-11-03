"use client"
import React from 'react'
import { Tabs, Tab } from "@nextui-org/react";

import ShopProducts from '@/components/table/ShopProducts';
import Orders from '@/components/card/Orders';
import Analysis from './Analysis';
import { getOrders } from '@/actions/order';
import { useAppSelector } from '@/redux/store';
import ShopAdvertisement from '@/components/table/ShopAdvertisement';

type IProps = {
  shopId: string
}

const Content: React.FC<IProps> = ({ shopId }) => {
  const [selected, setSelected] = React.useState<Set<any>>(new Set(["products"]));
  const [orders, setOrders] = React.useState<IOrders[] | []>([])
  const [isOrdersLoading, setIsOrdersLoading] = React.useState<boolean>(false)

  const data = useAppSelector(state => state.shopInfoReducer.value)
  const session = useAppSelector(state => state.sessionReducer.value)

  React.useEffect(() => {
    const fetchApi = async () => {
      switch (Array.from(selected)[0]) {
        case "orders":
          setIsOrdersLoading(true)
          const res = await getOrders({
            id: data?._id!,
            accessToken: session?.user.accessToken!,
            role: "shop"
          })

          if (res.code === 200) {
            const data = JSON.parse(res.data)
            setOrders(data)
            setIsOrdersLoading(false)
          } else {
            setIsOrdersLoading(false)
          }
          break;
        default:
          break;
      }
    }

    if (data || session) {
      fetchApi()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, data, session])

  return (
    <section>
      <Tabs
        aria-label="Dynamic tabs"
        color='primary'
        variant='light'
        className='max-w-full flex flex-col justify-center'
        selectedKey={Array.from(selected)[0]}
        onSelectionChange={(key) => setSelected(new Set([key]))}
      >
        <Tab key="products" title="Sản phẩm">
          {
            data && (
              <ShopProducts shopId={data?._id} shopAuth={session?.user._id === data?.auth._id} />
            )
          }
        </Tab>
        {
          session?.user.role === "shop" && session?.user._id === data?.auth._id && (
            <Tab key="orders" title="Đơn hàng">
              <Orders
                role={session?.user.role}
                isLoading={isOrdersLoading}
                orders={orders}
                shopId={shopId}
              />
            </Tab>
          )
        }
        {
          session?.user.role === "shop" && session?.user._id === data?.auth._id && (
            <Tab key="advertisement" title="Quảng cáo">
              <ShopAdvertisement shopId={shopId} />
            </Tab>
          )
        }
        {
          session?.user.role === "shop" && session?.user._id === data?.auth._id && (
            <Tab key="analysis" title="Thống kê">
              <Analysis shopId={shopId} accessToken={session?.user.accessToken} />
            </Tab>
          )
        }
      </Tabs>
    </section>
  )
}

export default React.memo(Content)