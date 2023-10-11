"use client"
import React, { Key } from 'react'
import { Tabs, Tab, Card, CardBody, CardHeader } from "@nextui-org/react";
import Products from './Products';
import Orders from './Orders';
import Analysis from './Analysis';

type IProps = {
  id: string,
  info: string,
  role: string,
  accessToken: string
}

const Content: React.FC<IProps> = ({ id, info, role, accessToken }) => {
  const [selected, setSelected] = React.useState<Set<any>>(new Set(["products"]));
  const data: IShopInfo = JSON.parse(info)

  return (
    <section>
      <Tabs
        aria-label="Dynamic tabs"
        color='primary'
        className='max-w-full flex flex-col justify-center'
        selectedKey={Array.from(selected)[0]}
        onSelectionChange={(key) => setSelected(new Set([key]))}
      >
        <Tab key="products" title="Sản phẩm">
          <Products shopId={data._id} />
        </Tab>
        {
          role === "shop" && id === data.auth._id && (
            <Tab key="orders" title="Đơn hàng">
              <Orders shopId={data._id} role={role} accessToken={accessToken} />
            </Tab>
          )
        }
        {
          role === "shop" && id === data.auth._id && (
            <Tab key="analysis" title="Thống kê">
              <Analysis />
            </Tab>
          )
        }
      </Tabs>
    </section>
  )
}

export default React.memo(Content)