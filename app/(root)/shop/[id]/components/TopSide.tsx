"use client"
import { Avatar, Card, Tooltip } from '@nextui-org/react'
import React from 'react'
import { BiUserCircle } from "react-icons/bi"
import { MdOutlineLocationOn } from "react-icons/md"
import { AiOutlinePhone } from "react-icons/ai"

type IProps = {
  info: string
}

const TopSide: React.FC<IProps> = ({ info }) => {
  const data: IShopInfo = JSON.parse(info)

  return (
    <section className='mt-4'>
      <Card shadow='sm' className='p-3'>
        <div className='flex flex-row gap-2'>
          <Avatar
            className="transition-transform w-20 h-20 text-large"
            src={data.auth.avatar}
          />
          <div>
            <p className='text-xl font-semibold'>{data.name}</p>
            <Tooltip content="Chủ sở hữu">
              <div className='flex flex-row gap-3 items-center'>
                <div className='flex flex-row items-center gap-1'>
                  <BiUserCircle />
                  <span>{data.auth.username || data.auth.email}</span>
                </div>
                <div className='flex flex-row items-center gap-1'>
                  <AiOutlinePhone />
                  <span>{data.auth.phone}</span>
                </div>
              </div>
            </Tooltip>

            <Tooltip
              content={`${data.address[0].apartment} - ${data.address[0].ward} - ${data.address[0].district} - ${data.address[0].province}`}>
              <div className='flex flex-row gap-1 items-center'>
                <MdOutlineLocationOn />
                <span>{data.address[0].province}</span>
              </div>
            </Tooltip>
          </div>
        </div>
      </Card>
    </section>
  )
}

export default TopSide
