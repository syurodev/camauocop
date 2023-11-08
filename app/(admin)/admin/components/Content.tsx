"use client"
import React from 'react'
import { Tab, Tabs } from '@nextui-org/react'
import { AiOutlineShop } from "react-icons/ai"
import { LuPalmtree } from "react-icons/lu"
import { RiMoneyDollarCircleLine } from "react-icons/ri"
import { SiGoogleadsense } from "react-icons/si"
import { HiSparkles } from "react-icons/hi2"

import AdminShops from '@/components/table/AdminShops'
import Analysis from './Analysis'
import AdminAdvertisement from '@/components/table/AdminAdvertisement'
import Tourism from './Tourism'
import Specialty from './Specialty'

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
          <AdminShops />
        </Tab>

        <Tab key="tourism" title={
          <div className='flex flex-row items-center gap-2'>
            <LuPalmtree className="text-lg" />
            <span>Quản lý du lịch</span>
          </div>
        }>
          <Tourism />
        </Tab>

        <Tab key="specialty" title={
          <div className='flex flex-row items-center gap-2'>
            <HiSparkles className="text-lg" />
            <span>Đặc sản</span>
          </div>
        }>
          <Specialty />
        </Tab>

        <Tab key="advertisement" title={
          <div className='flex flex-row items-center gap-2'>
            <SiGoogleadsense className="text-lg" />
            <span>Quản lý quảng cáo</span>
          </div>
        }>
          <AdminAdvertisement />
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