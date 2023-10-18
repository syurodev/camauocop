"use client"
import React from 'react'
import { Tabs, Tab } from "@nextui-org/react";

import Products from './Products';
import Orders from '@/components/card/Orders';
import Analysis from './Analysis';
import { getOrders } from '@/actions/order';

type IProps = {
  id: string,
  info: string,
  role: string,
  accessToken: string,
  shopId: string
}

const Content: React.FC<IProps> = ({ id, info, role, accessToken, shopId }) => {
  const [selected, setSelected] = React.useState<Set<any>>(new Set(["products"]));
  const [orders, setOrders] = React.useState<IOrders[] | []>([])
  const [isOrdersLoading, setIsOrdersLoading] = React.useState<boolean>(false)
  const data: IShopInfo = JSON.parse(info)

  React.useEffect(() => {
    const fetchApi = async () => {
      switch (Array.from(selected)[0]) {
        case "orders":
          setIsOrdersLoading(true)
          const res = await getOrders({
            id: data._id,
            accessToken: accessToken,
            role: "shop"
          })

          if (res.code === 200) {
            setOrders(res.data)
            setIsOrdersLoading(false)
          } else {
            setIsOrdersLoading(false)
          }
          break;
        default:
          break;
      }
    }
    fetchApi()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected])

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
          <Products shopId={data._id} shopAuth={id === data.auth._id} />
        </Tab>
        {
          role === "shop" && id === data.auth._id && (
            <Tab key="orders" title="Đơn hàng">
              <Orders
                role={role}
                isLoading={isOrdersLoading}
                orders={orders}
                shopId={shopId}
              />
            </Tab>
          )
        }
        {
          role === "shop" && id === data.auth._id && (
            <Tab key="analysis" title="Thống kê">
              <Analysis shopId={data._id.toString()} accessToken={accessToken} />
            </Tab>
          )
        }
      </Tabs>
    </section>
  )
}

export default React.memo(Content)