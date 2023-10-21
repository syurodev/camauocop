"use client"
import { useAppSelector } from '@/redux/store'
import { Avatar, Button, Card, Tooltip } from '@nextui-org/react'
import { Session } from 'next-auth'
import React from 'react'
import { BiUserCircle, BiPhoneCall } from "react-icons/bi"
import { MdOutlineLocationOn } from "react-icons/md"
import { RiSettings3Line } from "react-icons/ri"

type IProps = {
  info: string
}

const TopSide: React.FC<IProps> = ({ info }) => {
  const data: IShopInfo = JSON.parse(info)

  const session: Session | null = useAppSelector(state => state.sessionReducer.value)

  return (
    <section className='mt-4'>
      <Card shadow='sm' className='p-3 relative'>
        <div className='flex flex-row gap-2'>
          <Avatar
            className="transition-transform w-20 h-20 text-large"
            src={data.auth.avatar}
          />
          <div>
            <p className='text-xl font-semibold'>{data.name}</p>
            <Tooltip content="Chủ sở hữu">
              <div className='flex flex-col md:!flex-row md:!gap-3 md:!items-center'>
                <div className='flex flex-row items-center gap-1'>
                  <BiUserCircle />
                  <span>{data.auth.username || data.auth.email}</span>
                </div>
                <div className='flex flex-row items-center gap-1'>
                  <BiPhoneCall />
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

        {
          session && session.user.shopId === data._id && (
            <Tooltip content="Cài đặt cửa hàng">
              <Button
                isIconOnly
                variant='ghost'
                size='sm'
                className="border-none absolute top-3 right-3 z-30"
                radius='full'
              >
                <RiSettings3Line className="text-xl" />
              </Button>
            </Tooltip>
          )
        }
      </Card>
    </section>
  )
}

export default TopSide
