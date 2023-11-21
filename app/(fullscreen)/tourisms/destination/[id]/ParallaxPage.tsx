"use client"

import React, { useEffect, useRef, useState } from 'react'
import { useTransform, useScroll, motion, AnimatePresence } from 'framer-motion'
import Lenis from '@studio-freight/lenis'
import { IoIosArrowBack } from "react-icons/io";
import { useRouter } from 'next/navigation';
import { Button, Card, CardBody, Skeleton, User, useDisclosure } from '@nextui-org/react'
import Image from 'next/image'

import Column from './Column'
import useDimension from '@/lib/hooks/useDimension'
import RenderDescription from '@/app/(root)/products/product/[id]/components/RenderDescription'
import { useChunkArray } from '@/lib/hooks/useChunkArray';
import { getDestinations, getTourisms } from '@/actions/tourisms';
import toast from 'react-hot-toast';
import TourDetail from '@/components/modal/TourDetail';
import { formattedPriceWithUnit } from '@/lib/formattedPriceWithUnit';

type IProps = {
  destinationData: string | null,
  toursData: string | null,
};

const ParallaxPage: React.FC<IProps> = ({ destinationData, toursData }) => {
  const router = useRouter()

  const [data, setData] = useState<DestinationData | null>(destinationData ? JSON.parse(destinationData)[0] : null)
  const [tours, setTours] = React.useState<TourData[]>(toursData ? JSON.parse(toursData) : [])
  const [tourSelected, setTourSelected] = React.useState({
    _id: "",
    name: ""
  })
  const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure()

  const container = useRef(null)
  const { height } = useDimension()

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'end start']
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [0, height * 2])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, height * 3.3])
  const y3 = useTransform(scrollYProgress, [0, 1], [0, height * 1.25])
  const y4 = useTransform(scrollYProgress, [0, 1], [0, height * 3])
  const yValues = [y1, y2, y3, y4];

  const chunkedImages = useChunkArray(data?.images || [], 3)
  const chunkedImagesWithY = chunkedImages.map((array, index) => ({ images: array, y: yValues[index] }));

  useEffect(() => {
    const lenis = new Lenis()

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
  }, [])

  return (
    //Main
    <div className='relative overflow-x-hidden overflow-y-visible'>
      <Button
        isIconOnly
        radius='full'
        variant='solid'
        size='sm'
        className='absolute top-3 left-3 z-40'
        onPress={() => router.push("/tourisms")}
      >
        <IoIosArrowBack className="text-lg" />
      </Button>

      {
        data && (
          <AnimatePresence
            mode='wait'>
            <motion.div
              key={data._id}
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className='relative'
            >
              {/* spacer */}
              <div className='h-screen w-screen flex items-center justify-center relative overflow-hidden'>
                <div className='max-w-[85%] z-20 max-h-[65%] overflow-scroll absolute bottom-0 pb-2'>
                  <h2 className='text-[80px] font-bold text-center'>{data.name}</h2>
                  <RenderDescription description={data.description} />
                </div>
                <div className={`z-10 w-[200%] h-full bg-transparent absolute -bottom-2 blur-sm shadow-[inset_0_-71vh_50px_#fff]`}>

                </div>
                <div className='top-0 z-0 absolute w-screen h-screen'>
                  <Image
                    src={data?.images && data?.images.length > 0 ? data?.images[0] : ""}
                    alt="image"
                    fill
                    decoding='async'
                    className='object-cover box-border'
                  />
                </div>
              </div>
              {/* Gallery */}
              <div ref={container} className='h-[175vh] bg-[rgb(45,45,45)] flex flex-row gap-[2vw] p-[2vw] box-border overflow-hidden'>
                {
                  chunkedImagesWithY.map((item, index) => {
                    return (
                      <Column key={`column${index}`} images={item.images} y={item.y} index={index} />
                    )
                  })
                }
              </div>
              {/* spacer */}
              <div className='h-screen max-h-screen'>
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 p-5'>
                  {
                    tours.length > 0 ? tours.map((item) => {
                      return (
                        <Card
                          key={item._id}
                          shadow='sm'
                          radius="lg"
                          className="border-none m-auto h-64"
                          isPressable
                          onPress={() => {
                            setTourSelected({
                              _id: item._id,
                              name: item.tourName
                            })
                            onOpen()
                          }}
                        >
                          <CardBody className='flex flex-col gap-3 items-start'>
                            <User
                              name={item.username}
                              avatarProps={{
                                src: item.avatar
                              }}
                            />
                            <h3 className='font-semibold'>
                              {item.tourName}
                            </h3>

                            <div>
                              <p><span className='font-semibold'>Loại tour: </span><span>{item.tourTypeName}</span></p>
                              <p><span className='font-semibold'>Giá: </span><span className='text-primary'>{item.price > 0 ? formattedPriceWithUnit(item.price) : "Thương lượng"}</span></p>
                            </div>
                          </CardBody>
                        </Card>
                      )
                    }) : <p>Không có tour</p>
                  }
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )
      }

      {
        isOpen && (
          <TourDetail
            data={tourSelected}
            isOpen={isOpen}
            onClose={onClose}
            onOpenChange={onOpenChange}
          />
        )
      }
    </div>
  )
}

export default ParallaxPage