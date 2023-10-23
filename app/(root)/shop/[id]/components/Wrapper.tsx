"use client"
import { setShopInfo } from '@/redux/features/shop-info-slice'
import React, { ReactNode, useEffect } from 'react'
import { useDispatch } from 'react-redux'

export default function Wrapper({ children, info }: { children: ReactNode, info: string }) {
  const data = JSON.parse(info)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setShopInfo(data))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='flex flex-col gap-3'>
      {children}
    </div>
  )
}
