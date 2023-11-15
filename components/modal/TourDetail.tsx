"use client"
import React from 'react'
import { Avatar, Button, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, User } from '@nextui-org/react'
import { getTourDetail } from '@/actions/tourisms'
import { formattedPriceWithUnit } from '@/lib/formattedPriceWithUnit'

type IProps = {
  data: {
    _id: string,
    name: string
  }
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: () => void;
}

const TourDetail: React.FC<IProps> = ({
  data,
  isOpen,
  onClose,
  onOpenChange,
}) => {

  const [tourDetail, setTourDetail] = React.useState<TourDetailData>()

  React.useEffect(() => {
    const fetchApi = async () => {
      const res = await getTourDetail(data._id)

      if (res.code === 200) {
        setTourDetail(JSON.parse(res.data!))
      }
    }
    fetchApi()
  }, [data])

  const groupedByTime = tourDetail?.itinerary.reduce<{ time: string; action: string }[][]>((acc, item) => {
    if ('time' in item) {
      const existingGroup = acc.find(group => group[0].time === item.time);

      if (existingGroup) {
        existingGroup.push(item);
      } else {
        acc.push([item]);
      }
    }

    return acc;
  }, []);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='4xl' className='max-h-[90%] overflow-auto'>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{data.name}</ModalHeader>
            <ModalBody className='flex flex-col gap-4 items-start'>
              <User
                name={tourDetail?.username}
                avatarProps={{
                  src: tourDetail?.avatar
                }}
              />

              <div>
                <p>
                  <span className='font-semibold text-lg'>Phương tiện: </span>
                  <span>
                    {tourDetail?.transportation.map((item, index) => {
                      return <React.Fragment key={item._id}>
                        <span>{item.name}</span>
                        {index < tourDetail.transportation.length - 1 && ', '}
                      </React.Fragment>
                    })}
                  </span>
                </p>

                <p>
                  <span className='font-semibold text-lg'>Thời gian: </span>
                  <span>
                    {tourDetail?.duration}
                  </span>
                </p>

                <p>
                  <span className='font-semibold text-lg'>Loại tour: </span>
                  <span>
                    {tourDetail?.tourTypeName}
                  </span>
                </p>

                <p>
                  <span className='font-semibold text-lg'>Điểm đến: </span>
                  <span>
                    {tourDetail?.destinationName}
                  </span>
                </p>

                <p>
                  <span className='font-semibold text-lg'>Thông tin chổ ở: </span>
                  <span>
                    {tourDetail?.accommodation}
                  </span>
                </p>

                <p>
                  <span className='font-semibold text-lg'>Số người: </span>
                  <span>
                    {tourDetail?.numberOfPeople}
                  </span>
                </p>

                <p>
                  <span className='font-semibold text-lg'>Giá: </span>
                  <span className='text-primary'>
                    {`${formattedPriceWithUnit(tourDetail?.price)}/người`}
                  </span>
                </p>
              </div>

              <div>
                <p className='font-semibold text-lg'>Các hoạt động:</p>

                <div className='flex flex-col gap-3 ps-2'>
                  {groupedByTime?.map((item) => {
                    return (
                      <div key={item[0].time}>
                        <p className='font-bold'>{item[0].time}:</p>
                        <div className='ps-2'>
                          {item.map((action, index) => (
                            <p key={`${action.time}${index}`}>
                              <span className='font-semibold'>{index + 1}. </span>
                              <span>{action.action}</span>
                            </p>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>

              <div>
                <p className='font-semibold text-lg'>Dịch vụ bao gồm: </p>
                <div className='ps-2'>
                  {
                    tourDetail?.inclusions && tourDetail?.inclusions.length > 0 && tourDetail?.inclusions.map((item, index) => {
                      return (
                        <p key={`inclusions${index}`}>
                          <span className='font-semibold'>{index + 1}.  </span>
                          <span>{item.content}</span>
                        </p>
                      )
                    })
                  }
                </div>
              </div>

              <div>
                <p className='font-semibold text-lg'>Dịch vụ không bao gồm: </p>
                <div className='ps-2'>
                  {
                    tourDetail?.exclusions && tourDetail?.exclusions.length > 0 && tourDetail?.exclusions.map((item, index) => {
                      return (
                        <p key={`exclusions${index}`}>
                          <span className='font-semibold'>{index + 1}.  </span>
                          <span>{item.content}</span>
                        </p>
                      )
                    })
                  }
                </div>
              </div>

              <div>
                <p className='font-semibold text-lg'>Thông tin liên hệ:</p>

                <div className='px-2'>
                  <p>
                    <span className='font-semibold'>Tên: </span>
                    <span>
                      {tourDetail?.contactInformation.name}
                    </span>
                  </p>

                  <p>
                    <span className='font-semibold'>Số điện thoại: </span>
                    <span>
                      {tourDetail?.contactInformation.phone}
                    </span>
                  </p>

                  <p>
                    <span className='font-semibold'>Email: </span>
                    <span>
                      {tourDetail?.contactInformation.email || ""}
                    </span>
                  </p>

                  <p>
                    <span className='font-semibold'>Liên kết: </span>
                    <Link
                      isExternal
                      href={tourDetail?.contactInformation.link}
                    >
                      Liên kết
                    </Link>
                  </p>
                </div>
              </div>

              <div className='flex flex-row items-center gap-3'>
                <p className='font-semibold text-lg'>File mô tả: </p>
                {
                  tourDetail?.tourContracts && tourDetail?.tourContracts.length > 0 && tourDetail?.tourContracts.map((item, index) => {
                    return (
                      <Link
                        key={index}
                        href={item}
                        isExternal
                      >
                        <Avatar
                          name={(index + 1).toString()}
                          size='sm'
                        />
                      </Link>
                    )
                  })
                }
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="bordered" onPress={onClose}>
                Đóng
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default TourDetail