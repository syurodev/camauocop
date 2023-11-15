"use client"

import React from 'react'
import { Button, Image, Tooltip, useDisclosure } from '@nextui-org/react'
import { motion, AnimatePresence } from 'framer-motion'
import { BiHomeAlt2 } from "react-icons/bi"
import { useRouter } from 'next/navigation'
import { CiViewList } from "react-icons/ci"

import RenderDescription from '@/app/(root)/products/product/[id]/components/RenderDescription'
import BigModal from '@/components/modal/BigModal'
import TourList from '@/components/modal/TourList'

type IProps = {
  data: string
}

const PageContent: React.FC<IProps> = ({ data }) => {
  let destinations: DestinationData[] = []

  if (data !== "") {
    destinations = JSON.parse(data)
  }
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = React.useState<number>(0)
  const [destinationSelected, setDestinationSelected] = React.useState({
    _id: "",
    name: ""
  })

  return (
    <>
      {
        destinations.length > 0 ? (
          <div>
            <motion.div
              className='relative w-screen h-screen'
            >
              <div
                className='flex flex-row top-5 left-3 gap-4 w-fit fixed z-40'
              >
                <Button
                  isIconOnly
                  size='sm'
                  radius='full'
                  variant='faded'
                  className='border-none'
                  onPress={() => router.push("/")}
                >
                  <BiHomeAlt2 className="text-xl" />
                </Button>
              </div>

              <AnimatePresence mode="wait">
                <>
                  <motion.div
                    key={"nomalView"}
                    className='flex items-center justify-center h-full z-20'
                    initial={{ y: -15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 15, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AnimatePresence mode="wait">
                      {
                        destinations.map((destination, index) => {
                          return (
                            index === currentIndex ? (
                              <motion.div
                                key={`${destination._id}item${index}`}
                                initial={{ y: -15, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 15, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className='mb-[50px] p-2 lg:!p-0'
                              >
                                <div className='flex flex-col lg:!flex-row justify-center items-start gap-3'>
                                  <Image
                                    src={destination.images[0]}
                                    alt={destination.name}
                                    radius='lg'
                                    width={300}
                                    height={300}
                                    shadow='md'
                                    className='object-cover min-w-[300px] min-h-[300px] max-w-[300px] max-h-[300px]'
                                  />

                                  <div
                                    className='max-w-[500px] max-h-[300px] flex flex-col gap-2'
                                  >
                                    <div className='flex flex-row justify-between items-center'>
                                      <motion.h2
                                        initial={{ y: 15, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -15, opacity: 0 }}
                                        transition={{ duration: 0.3, delay: 0.2 }}
                                        className='font-bold text-4xl'
                                      >
                                        {destination.name}
                                      </motion.h2>

                                      <motion.div
                                        initial={{ y: -15, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: 15, opacity: 0 }}
                                        transition={{ duration: 0.3, delay: 0.3 }}
                                      >

                                        <Tooltip
                                          content="Xem sản phẩm"
                                        >
                                          <Button
                                            color='primary'
                                            isIconOnly
                                            radius='full'
                                            size='sm'
                                            className='border-none'
                                            onPress={() => {
                                              setDestinationSelected({
                                                _id: destination._id,
                                                name: destination.name
                                              })
                                              onOpen()
                                            }}
                                          >
                                            <CiViewList className="text-lg" />
                                          </Button>
                                        </Tooltip>
                                      </motion.div>

                                    </div>

                                    <div
                                      className='overflow-y-auto'
                                    >
                                      <motion.h4
                                        initial={{ y: 15, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -15, opacity: 0 }}
                                        transition={{ duration: 0.3, delay: 0.4 }}
                                      >
                                        <RenderDescription description={destination.description} />
                                      </motion.h4>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ) : (<></>)
                          )
                        })
                      }
                    </AnimatePresence>
                  </motion.div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      className='absolute bottom-4 left-1/2 -translate-x-1/2 w-full items-center lg:!justify-center flex flex-row gap-4 overflow-auto z-30'
                    >
                      {
                        destinations.map((destination, index) => {
                          return (
                            <Tooltip
                              content={destination.name}
                              key={`imageButton${destination._id}${index}`}

                            >
                              <motion.div
                                initial={{ y: 15, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 15, opacity: 0 }}
                                transition={{ duration: 0.3, delay: index / 10 }}
                              >
                                <Image
                                  src={destination.images[0]}
                                  alt={destination.name}
                                  radius='full'
                                  width={35}
                                  height={35}
                                  className='object-cover min-w-[35px] min-h-[35px] max-w-[35px] max-h-[35px] cursor-pointer'
                                  onClick={() => setCurrentIndex(index)}
                                />
                              </motion.div>
                            </Tooltip>
                          )
                        })
                      }

                    </motion.div>
                  </AnimatePresence>

                  <motion.div
                    className='absolute z-0 top-0 blur-3xl select-none cursor-default pointer-events-none'
                  >
                    <AnimatePresence mode="wait">
                      {
                        destinations.map((destination, index) => {
                          return (
                            index === currentIndex ? (
                              <motion.div
                                key={`bgImage${index}${destination._id}`}
                                initial={{ y: -15, opacity: 0 }}
                                animate={{ y: 0, opacity: 0.4 }}
                                exit={{ y: 15, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <Image
                                  src={destination.images[0]}
                                  alt={destination.name}
                                  radius='none'
                                  width={"auto"}
                                  className='object-cover w-screen h-screen select-none cursor-default pointer-events-none brightness-75'
                                />
                              </motion.div>
                            ) : (<></>)
                          )
                        })
                      }
                    </AnimatePresence>
                  </motion.div>
                </>
              </AnimatePresence>
            </motion.div>
          </div>
        ) : <p>Không có đặc sản</p>
      }

      <BigModal
        isOpen={isOpen}
        onClose={onClose}
        onOpenChange={onOpenChange}
        title={destinationSelected.name}
      >
        <TourList data={destinationSelected} />
      </BigModal>
    </>
  )
}

export default PageContent
