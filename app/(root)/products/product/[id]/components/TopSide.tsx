"use client"

import Link from 'next/link'
import React from 'react'

import SlideShow from '@/components/elements/SlideShow'
import { formattedPriceWithUnit } from '@/lib/formattedPriceWithUnit'
import ActionButtons from './ActionButtons'
import { Card, CardBody, Chip } from '@nextui-org/react';

type IProps = {
  productData: string
}

const TopSide: React.FC<IProps> = ({ productData }) => {
  const data: IProductDetail = JSON.parse(productData)
  console.log(data)
  return (
    <div className="flex flex-col lg:!flex-row gap-5">
      <SlideShow images={data?.productImages || []} />

      <div className="lg:w-1/2 flex flex-col gap-3">
        <div className='flex flex-col gap-3 items-start'>
          <h1 className="font-bold text-4xl uppercase">{data?.productName}</h1>
          <Link href={`/products/${data?.productTypeName}`} className="text-lg uppercase font-semibold opacity-70">
            {data?.productTypeName}
          </Link>

          {
            data?.specialty && (
              <Chip color="success" variant="flat">Đặc sản</Chip>
            )
          }
        </div>

        <div className="flex items-end justify-between">
          <div className='flex flex-row items-end gap-3'>
            <div>
              <span
                className={`
            text-4xl font-semibold
            ${data.rating > 3.9 ? "text-success" : data.rating > 2.5 ? "text-warning" : "text-danger"}
            `}>
                {data.rating}
              </span>
              <span className='text-4xl font-semibold'>/</span>
              <span>5</span>
            </div>
            <p>{data.numberOfRatings} đánh giá</p>
          </div>
          <p>{`${data?.productSold}kg đã bán`}</p>
        </div>

        <h2 className="text-center my-2 font-bold">
          {data?.productPrice ?
            `Giá bán lẻ: ${formattedPriceWithUnit(data?.productPrice)}`
            : "Không có giá bán lẻ"}
        </h2>

        <p className="text-center">
          Số lượng còn lại: {data?.productQuantity.toFixed(2)}Kg
        </p>

        <div className='grid grid-cols-2 md:grid-cols-3 items-center gap-3 select-none pointer-events-none max-w-full h-fit'>
          {
            data?.packageOptions.length > 0 && data?.packageOptions.map((item, index) => {
              return (
                <Card key={index} shadow='sm' className='w-full'>
                  <CardBody>
                    <p>Gói: {item.weight}{item.unit}</p>
                    <p>Giá: <span className='text-primary font-semibold'>{formattedPriceWithUnit(item.price)}</span></p>
                  </CardBody>
                </Card>
              )
            })
          }
        </div>

      </div>

      <div className="lg:!hidden">
        <ActionButtons data={JSON.stringify(data)} />
      </div>
    </div>
  )
}

export default TopSide