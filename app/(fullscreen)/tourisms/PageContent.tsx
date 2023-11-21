"use client"

import React from 'react'
import { Button, Card, CardBody, CardHeader, Image, useDisclosure } from '@nextui-org/react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { GoHome } from "react-icons/go";

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
  const [destinationSelected, setDestinationSelected] = React.useState({
    _id: "",
    name: ""
  })

  return (
    <>
      <div
        className='grid items-center sm:grid-cols-2 grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4 xl:gap-5 p-5 relative'
      >
        <Button
          isIconOnly
          radius='full'
          variant='solid'
          size='sm'
          className='absolute top-3 left-3 z-40'
          onPress={() => router.push("/")}
        >
          <GoHome className="text-lg" />
        </Button>

        {
          destinations.length > 0 ? destinations.map((item, index) => {
            return (
              <motion.div
                key={`gridViewImage${item._id}`}
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 15, opacity: 0 }}
                transition={{ duration: 0.3, delay: index / 10 }}
                className='m-auto'
              >
                <Card
                  className="py-4 max-w-[258px]"
                  isPressable
                  onPress={() => router.push(`/tourisms/destination/${item._id}`)}
                >
                  <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                    <p className="text-tiny uppercase font-bold text-primary">Đặc sản</p>
                    <div className='w-full max-h-[60px] overflow-hidden text-small'>
                      <RenderDescription description={item.description} />
                    </div>
                    <h4 className="font-bold text-large line-clamp-1">{item.name}</h4>
                  </CardHeader>
                  <CardBody className="overflow-visible py-2">
                    <Image
                      alt="Card background"
                      className="object-cover rounded-xl w-[270px] h-[200px]"
                      src={item.images[0]}
                      width={270}
                      height={200}
                    />
                  </CardBody>
                </Card>
              </motion.div>
            )
          }

          ) : <p>Không có đặc sản</p>
        }
      </div>

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
