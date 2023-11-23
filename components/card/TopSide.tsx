"use client"
import React, { useEffect } from 'react'
import { Avatar, AvatarGroup, Button, Card, Tooltip, useDisclosure } from '@nextui-org/react'
import { Session } from 'next-auth'
import { BiPhoneCall } from "react-icons/bi"
import { MdOutlineLocationOn } from "react-icons/md"
import { RiSettings3Line } from "react-icons/ri"

import ShopSetting from '../modal/ShopSetting'
import { useAppSelector } from '@/redux/store'

const TopSide: React.FC = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const session: Session | null = useAppSelector(state => state.sessionReducer.value)

  const data = useAppSelector(state => state.shopInfoReducer.value)

  return (
    data && (
      <section className='mt-4'>
        <Card shadow='sm' className='p-3 relative'>
          <div className='flex flex-row gap-3'>
            <Avatar
              className="transition-transform w-20 h-20 text-large"
              src={data.image || ""}
            />
            <div className='flex flex-col items-start justify-start gap-2'>
              <p className='text-xl font-semibold'>{data.name || "Không tìm thấy cửa hàng"}</p>

              <AvatarGroup size='sm' isBordered max={3} total={data.staffs.length} className='ms-3'>
                <>
                  {
                    data.staffs.length > 0 && data.staffs.map((staff) => {
                      return (
                        <Avatar key={`avatar staff ${staff._id}`} size='sm' src={staff.avatar} />
                      )
                    })
                  }
                  <Avatar size='sm' src={data.auth.avatar} color='primary' />
                </>
              </AvatarGroup>

              <div className='flex flex-row items-center gap-3'>
                <div className='flex flex-row items-center gap-1'>
                  <BiPhoneCall />
                  <span>{data.phone}</span>
                </div>

                <Tooltip
                  content={`${data.address[0].apartment} - ${data.address[0].ward} - ${data.address[0].district} - ${data.address[0].province}`}>
                  <div className='flex flex-row gap-1 items-center'>
                    <MdOutlineLocationOn />
                    <span>{data.address[0].province}</span>
                  </div>
                </Tooltip>
              </div>

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
                  onPress={onOpen}
                >
                  <RiSettings3Line className="text-xl" />
                </Button>
              </Tooltip>
            )
          }
        </Card>

        {
          isOpen && (
            <ShopSetting
              isOpen={isOpen}
              onClose={onClose}
              onOpenChange={onOpenChange}
              shopId={data._id}
            />
          )
        }
      </section>
    )
  )
}

export default TopSide
