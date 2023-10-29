"use client"

import Link from 'next/link'
import React from 'react'
import { AiOutlineStar, AiFillStar } from "react-icons/ai";

import SlideShow from '@/components/elements/SlideShow'
import { formattedPriceWithUnit } from '@/lib/formattedPriceWithUnit'
import ActionButtons from './ActionButtons'
import { Chip } from '@nextui-org/react';

type IProps = {
  productData: string
}

const TopSide: React.FC<IProps> = ({ productData }) => {
  const data: IProductDetail = JSON.parse(productData)
  return (
    <div className="flex flex-col lg:!flex-row gap-5">
      <SlideShow images={data?.productImages || []} />

      <div className="lg:w-1/2">
        <div className='flex flex-col gap-3 items-start'>
          <h1 className="font-bold text-4xl uppercase">{data?.productName}</h1>
          <Link href={`/products/${data?.productTypeName}`} className="text-lg uppercase font-semibold opacity-70">
            {data?.productTypeName}
          </Link>

          {
            data.specialty && (
              <Chip color="success" variant="flat">Đặc sản</Chip>
            )
          }
        </div>

        <div className="flex items-center justify-between">
          <div className="flex text-primary">
            <AiFillStar />
            <AiFillStar />
            <AiFillStar />
            <AiOutlineStar />
            <AiOutlineStar />
          </div>
          <p>1000 đánh giá</p>
          <p>{`${data?.productSold}kg đã bán`}</p>
        </div>

        <h2 className="text-center my-2 font-bold">
          {data?.productPrice ?
            `Giá bán lẻ: ${formattedPriceWithUnit(data?.productPrice)}`
            : "Không có giá bán lẻ"}
        </h2>

        <p className="text-center">
          Số lượng còn lại: {data?.productQuantity}Kg
        </p>
      </div>

      <div className="lg:!hidden">
        <ActionButtons data={JSON.stringify(data)} />
      </div>
    </div>
  )
}

export default TopSide