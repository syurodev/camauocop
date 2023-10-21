"use client"

import { User } from '@nextui-org/react'
import React from 'react'
import { MdOutlineLocationOn } from "react-icons/md"
import { useRouter } from "next/navigation";

type IProps = {
  data: string
}

const ShopInfo: React.FC<IProps> = ({ data }) => {
  const router = useRouter()
  const shopInfo: IProductDetail = JSON.parse(data)

  return (
    shopInfo ? (
      <div className='flex flex-row justify-between items-center'>
        <User
          as={"button"}
          name={shopInfo.shopInfo.name}
          description={shopInfo.shopInfo.phone}
          avatarProps={{
            src: shopInfo?.shopInfo.image
          }}
          onClick={() => router.push(`/shop/${shopInfo.shopId}`)}
        />

        <div className='flex flex-row items-center gap-1 text-small'>
          <MdOutlineLocationOn />
          <span>{shopInfo.shopInfo.address[0].province}</span>
        </div>
      </div>
    ) : (<></>)
  )
}

export default ShopInfo