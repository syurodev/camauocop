"use client"

import React from 'react'
import { Accordion, AccordionItem, Button, Card, CardBody, CardFooter, Image, Pagination, Skeleton } from '@nextui-org/react'
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { motion, AnimatePresence } from 'framer-motion'
import { CiMenuKebab } from "react-icons/ci"

import { getProducts } from '@/actions/products'
import CardItem from '@/components/card/CardItem'
import { useAppSelector } from '@/redux/store'
import { getShopProductType } from '@/actions/productType';

type IProps = {
  shopId: string
  shopAuth: boolean
}

const ShopProducts: React.FC<IProps> = ({ shopId, shopAuth }) => {
  const [productTypes, setProductTypes] = React.useState<{
    _id: string,
    typeName: string
  }[]>([]);
  const [page, setPage] = React.useState<number>(1);
  const [totalPage, setTotalPage] = React.useState<number>(1);
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [products, setProducts] = React.useState<IProducts[]>([]);
  const [currentAdsIndex, setCurrentAdsIndex] = React.useState<number>(0);
  const [showFilter, setShowFilter] = React.useState<boolean>(false);
  const [typeId, setTypeId] = React.useState<string>("all");

  React.useEffect(() => {
    const fetchApi = async () => {
      const res = await getShopProductType(shopId)
      if (res.code === 200) {
        setProductTypes(res.data!)
      }
    }
    fetchApi()
  }, [shopId])

  React.useEffect(() => {
    const fetchApi = async () => {
      setIsLoading(true)
      const data = await getProducts(1, 12, shopId, false, typeId)
      setProducts(data.products)
      setTotalPage(data.totalPages || 1)
      setIsLoading(false)
    }
    fetchApi()
  }, [shopId, typeId])

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

      <div className="flex flex-row items-start gap-6 mt-3">
        <AnimatePresence mode="wait">
          {
            showFilter && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 350, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="sticky lg:hidden"
              >
                <div className="w-[350px] flex flex-col gap-4">
                  <Accordion
                    variant="bordered"
                    isCompact
                    defaultExpandedKeys={["1"]}
                  >
                    <AccordionItem key="1" aria-label="Loại sản phẩm" title="Loại sản phẩm">
                      <div className="flex flex-col gap-3">
                        <Button
                          key={"all"}
                          variant="flat"
                          className="border-none"
                          size="sm"
                          onPress={() => {
                            setTypeId("all")
                            setShowFilter(false)
                          }}
                        >
                          Tất cả
                        </Button>
                        {
                          productTypes.map((productType, index) => {
                            return (
                              <Button
                                key={index}
                                variant="flat"
                                className="border-none"
                                size="sm"
                                onPress={() => {
                                  setTypeId(productType._id)
                                  setShowFilter(false)
                                }}
                              >
                                {
                                  productType.typeName
                                }
                              </Button>
                            )
                          })
                        }
                      </div>
                    </AccordionItem>

                    {/* <AccordionItem key="2" aria-label="Khoản giá" title="Khoản giá">
                    2
                  </AccordionItem> */}

                    {/* <AccordionItem key="3" aria-label="Accordion 3" title="Accordion 3">
        3
      </AccordionItem> */}
                  </Accordion>
                </div>
              </motion.div>
            )
          }

          <div className="min-w-[300px] max-w-[350px] hidden lg:!flex lg:!flex-col lg:!gap-4">
            <Accordion
              variant="bordered"
              isCompact
              defaultExpandedKeys={["1"]}
            >
              <AccordionItem key="1" aria-label="Loại sản phẩm" title="Loại sản phẩm">
                <div className="flex flex-col gap-3">
                  <Button
                    key={"all"}
                    variant="flat"
                    className="border-none"
                    size="sm"
                    onPress={() => setTypeId("all")}
                  >
                    Tất cả
                  </Button>
                  {
                    productTypes.map((productType, index) => {
                      return (
                        <Button
                          key={index}
                          variant="flat"
                          className="border-none"
                          size="sm"
                          onPress={() => setTypeId(productType._id)}
                        >
                          {
                            productType.typeName
                          }
                        </Button>
                      )
                    })
                  }
                </div>
              </AccordionItem>

              {/* <AccordionItem key="2" aria-label="Khoản giá" title="Khoản giá">
              2
            </AccordionItem> */}

              {/* <AccordionItem key="3" aria-label="Accordion 3" title="Accordion 3">
        3
      </AccordionItem> */}
            </Accordion>
          </div>

          <motion.div
            className="flex flex-col items-center gap-4 w-full"
            initial={{ width: "100%", height: 0, opacity: 0 }}
            animate={{ width: "100%", height: "auto", opacity: 1 }}
            exit={{ width: "100%", height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* SORT */}
            <div className="w-full flex justify-between lg:!justify-end gap-3">
              <Button
                isIconOnly
                size="sm"
                radius="full"
                className="lg:hidden"
                onPress={() => setShowFilter(!showFilter)}
              >
                <CiMenuKebab className="text-small" />
              </Button>
            </div>

            <AnimatePresence mode="wait">
              <div className="mt-5 w-full grid items-center sm:grid-cols-2 grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4 xl:gap-5">
                {
                  isLoading ? (
                    Array.from({ length: 10 }).map((_, index) => (
                      <motion.div
                        initial={{ y: 15, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 15, opacity: 0 }}
                        transition={{ duration: 0.3, delay: index / 10 }}
                        key={index}
                      >
                        <Card shadow="sm" >
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
                      </motion.div>
                    ))
                  ) : products && products.length > 0 ? products.map((product, index) => (
                    <motion.div
                      initial={{ y: 15, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 15, opacity: 0 }}
                      transition={{ duration: 0.3, delay: index / 10 }}
                      key={product?._id}
                    >
                      <CardItem
                        key={`product${product?._id}`}
                        data={product}
                        editButton={shopAuth || false}
                        deleteButton={shopAuth || false}
                      />
                    </motion.div>
                  )) : <span>Không có sản phẩm</span>
                }
              </div>
            </AnimatePresence>

            <Pagination showControls total={totalPage || 1} initialPage={page} onChange={setPage} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default React.memo(ShopProducts)