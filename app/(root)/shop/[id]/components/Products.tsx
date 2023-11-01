"use client"

import React from 'react'
import { Button, Card, CardBody, CardFooter, Image, Skeleton } from '@nextui-org/react'
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { motion, AnimatePresence } from 'framer-motion'

import { getProducts } from '@/actions/products'
import CardItem from '@/components/card/CardItem'
import { useAppSelector } from '@/redux/store'

type IProps = {
  shopId: string
  shopAuth: boolean
}

const Products: React.FC<IProps> = ({ shopId, shopAuth }) => {

  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [products, setProducts] = React.useState<IProducts[]>([]);
  const [currentAdsIndex, setCurrentAdsIndex] = React.useState<number>(0);

  React.useEffect(() => {
    const fetchApi = async () => {
      setIsLoading(true)
      const data = await getProducts(1, 12, shopId)
      setProducts(data.products)
      setIsLoading(false)
    }
    fetchApi()
  }, [shopId])

  const ads = useAppSelector(state => state.shopInfoReducer.value?.ads)

  const prevSlide = () => {
    if (ads) {
      if (currentAdsIndex <= 0) {
        setCurrentAdsIndex(ads?.length - 1);
      } else {
        setCurrentAdsIndex(currentAdsIndex - 1);
      }
    }
  };

  const nextSlide = () => {
    if (ads) {
      if (currentAdsIndex >= ads?.length - 1) {
        setCurrentAdsIndex(0);
      } else {
        setCurrentAdsIndex(currentAdsIndex + 1);
      }
    }
  };

  return (
    <div
      className='flex flex-col gap-4'
    >
      {
        ads && ads.length > 0 && (
          <AnimatePresence mode='wait'>
            <div
              className='relative w-full h-[300px]'
            >
              <Button
                isIconOnly
                radius="full"
                color='primary'
                className={`absolute opacity-25 hover:opacity-100 transition-all duration-200 z-20 top-1/2 -translate-y-1/2 left-3 ${ads.length <= 1 ? "hidden" : "flex"}`}
                onPress={prevSlide}
              >
                <GrFormPrevious className="text-xl" />
              </Button>

              <Button
                isIconOnly
                radius="full"
                color='primary'
                className={`absolute opacity-25 hover:opacity-100 transition-all duration-200 z-20 top-1/2 -translate-y-1/2 right-3 ${ads.length <= 1 ? "hidden" : "flex"}`}
                onPress={nextSlide}
              >
                <GrFormNext className="text-xl" />
              </Button>

              {
                ads.map((ads, index) => {
                  return (
                    index === currentAdsIndex && (
                      <motion.div
                        className='w-full h-[300px]'
                        initial={{ y: 15, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 15, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        key={index}
                      >
                        <Image
                          src={ads}
                          alt='ads'
                          width={"100%"}
                          radius='md'
                          className='w-full h-[300px] object-cover z-10'
                        />
                      </motion.div>
                    )
                  )
                })
              }
            </div>
          </AnimatePresence>
        )
      }
      <div className="grid items-center sm:grid-cols-2 grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3 lg:gap-4 xl:gap-5">
        {isLoading
          ? Array.from({ length: 12 }).map((_, index) => (
            <Card shadow="sm" key={index}>
              <Skeleton isLoaded={!isLoading} className="rounded-lg">
                <CardBody className="overflow-visible p-0">
                  <div className="w-full h-[140px]"></div>
                </CardBody>
              </Skeleton>

              <CardFooter className="flex flex-col text-small justify-between">
                <Skeleton isLoaded={!isLoading} className="rounded-lg">
                  <b className="line-clamp-2">productname</b>
                </Skeleton>
                <Skeleton isLoaded={!isLoading} className="rounded-lg mt-2">
                  <p className="text-default-500">productprice</p>
                </Skeleton>
              </CardFooter>
            </Card>
          ))
          : products.length > 0 &&
          products.map((item) => {
            return <CardItem
              key={item?._id}
              data={item}
              editButton={shopAuth || false}
              deleteButton={shopAuth || false}
            />;
          })}
      </div>
    </div>
  )
}

export default React.memo(Products)