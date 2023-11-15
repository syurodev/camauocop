"use client"

import { getTourisms } from '@/actions/tourisms';
import { formattedPriceWithUnit } from '@/lib/formattedPriceWithUnit';
import { Button, Card, CardBody, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Skeleton, User, useDisclosure } from '@nextui-org/react';
import React from 'react'
import TourDetail from './TourDetail';

type IProps = {
  data: {
    _id: string;
    name: string;
  }
}

const TourList: React.FC<IProps> = (data) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [tours, setTours] = React.useState<TourData[]>([])
  const [tourSelected, setTourSelected] = React.useState({
    _id: "",
    name: ""
  })
  const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure()

  React.useEffect(() => {
    const fetchApi = async () => {
      setIsLoading(true)
      const res = await getTourisms({
        destinationId: data.data._id,
        status: 'accepted'
      })
      setIsLoading(false)

      if (res.code === 200) {
        setTours(JSON.parse(res.data!))
      }
    }
    fetchApi()
  }, [data])

  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5'>
      {
        isLoading ? (
          <Skeleton />
        ) : (
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

export default TourList