'use client'

import * as React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

import { Button } from '../ui/button';
import { IProducts } from '@/lib/interface/interface';

interface CardItemProps {
  data: IProducts;
}

const CardItem: React.FC<CardItemProps> = ({ data }) => {
  function base64ToDataURL(image: string) {
    return `data:image/jpg;base64,${image}`;
  }

  console.log(data)

  return (
    // className='bg-white/50 dark:bg-dark-gray dark:shadow-none rounded-lg shadow-box w-[280px] p-4 mx-auto mt-[24px] cursor:pointer'
    <motion.div
      className='rounded-lg w-[280px] p-4 mx-auto mt-[24px] cursor:pointer'
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.7 }}
      layout
    >
      <div className='relative w-[200px] h-[200px] overflow-hidden rounded-lg mx-auto'>
        {/* TODO:Fix image */}

        {/* <Image src={`data:image/jpg;base64,${data.images[0]}`} alt='' style={{ maxWidth: "100%", height: "auto" }} className='object-cover absolute top-0 left-0 bottom-0 right-0' priority /> */}
        {/* {
          data?.images && data?.images.map((image, index) => {
            return (
              <Image key={index} src={base64ToDataURL(image)} alt='' style={{ maxWidth: "100%", height: "auto" }} className='object-cover absolute top-0 left-0 bottom-0 right-0' priority />
            )
          })
        } */}
      </div>

      <div className='mt-4'>
        <h3 className='font-semibold text-center'>
          {data?.name}
        </h3>
        <h4 className='font-normal text-center text-xs'>
          {data?.sellerId.name || data?.sellerId.username}
        </h4>
        <h4 className='font-normal text-center text-xs'>
          {data?.productType.name}
        </h4>
        <h4 className='font-normal text-center text-xs'>
          {data?.price}
        </h4>
      </div>

      {/* <div className='mt-4 flex items-center justify-center'>
        <Button square variant='outline-success' className='rounded-full'>10000vnd</Button>
        <Button square variant='outline-success' className='rounded-full'>
          <IonIcon icon={heartOutline} className='dark:text-white text-xl' />
        </Button>
      </div> */}
    </motion.div>
  );
}

export default CardItem