"use client"

import React from 'react'
import Image from 'next/image'
import { MotionValue, motion } from 'framer-motion'

type IProps = {
  images: string[],
  y: MotionValue<number>,
  index: number
}

const Column: React.FC<IProps> = ({ images, y = 0, index }) => {
  function getCustomClass(index: number): string {
    // Tùy chỉnh các giá trị dựa trên index
    switch (index) {
      case 0:
        return 'top-[-45%]';
      case 1:
        return 'top-[-95%]';
      case 2:
        return 'top-[-40%]';
      case 3:
        return 'top-[-75%]';
      default:
        return ''; // Trường hợp không xác định
    }
  }

  return (
    //column
    <motion.div
      style={{ y: y }}
      className={`w-1/4 h-full flex flex-col gap-[2vw] min-w-[250px] relative ${getCustomClass(index)}`}
    >
      {
        images.map((src, index) => {
          return (
            //image container
            <div key={index} className='w-full h-full relative rounded-xl overflow-hidden'>
              <Image
                src={src}
                alt='image'
                fill
                className='object-cover'
              />
            </div>
          )
        })
      }
    </motion.div>
  )
}

export default Column