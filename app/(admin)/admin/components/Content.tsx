"use client"
import React from 'react'
import { Tab, Tabs } from '@nextui-org/react'
import { AiOutlineShop } from "react-icons/ai"
import { RiMoneyDollarCircleLine } from "react-icons/ri"
import { SiGoogleadsense } from "react-icons/si"

import Shops from './Shops'
import Analysis from './Analysis'
import Advertisement from './Advertisement'

const AdminContent: React.FC = () => {
  const [selected, setSelected] = React.useState<Set<any>>(new Set(["shops"]));

  return (
    <div>
      <Tabs
        aria-label="Dynamic tabs"
        color='primary'
        variant='light'
        className='max-w-full flex flex-col justify-center'
        selectedKey={Array.from(selected)[0]}
        onSelectionChange={(key) => setSelected(new Set([key]))}
      >
        <Tab key="shops" title={
          <div className='flex flex-row items-center gap-2'>
            <AiOutlineShop className="text-lg" />
            <span>Quản lý shop</span>
          </div>
        }>
          <Shops />
        </Tab>

        <Tab key="advertisement" title={
          <div className='flex flex-row items-center gap-2'>
            <SiGoogleadsense className="text-lg" />
            <span>Quản lý quảng cáo</span>
          </div>
        }>
          <Advertisement />
        </Tab>

        <Tab key="analysis" title={
          <div className='flex flex-row items-center gap-2'>
            <RiMoneyDollarCircleLine className="text-lg" />
            <span>Quản lý doanh thu</span>
          </div>
        }>
          <Analysis />
        </Tab>
      </Tabs>

    </div>
  )
}

export default AdminContent