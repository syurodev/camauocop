"use client"

import React from 'react'
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Avatar, Button, Card, CardBody, CardHeader, Divider, Input, Link, Select, SelectItem, Skeleton, Spinner } from '@nextui-org/react';

import { ITourSchema, tourSchema } from '@/lib/zodSchema/tourSchema';
import { addTourism, getDestinations, getTourType, getTransportation } from '@/actions/tourisms';
import toast from 'react-hot-toast';
import { UploadButton } from '@/lib/uploadthing';
import { useAppSelector } from '@/redux/store';
import { Session } from 'next-auth';

const AddTourismsForm = () => {
  const [tourContracts, setTourContracts] = React.useState<string[]>([])
  const [destinations, setDestinations] = React.useState<DestinationData[]>([])
  const [destinationsLoading, setDestinationsLoading] = React.useState<boolean>(true)
  const [transportations, setTransportations] = React.useState<TransportationData[]>([])
  const [transportationsLoading, setTransportationsLoading] = React.useState<boolean>(true)
  const [tourTypes, setTourTypes] = React.useState<TourTypeData[]>([])
  const [tourTypesLoading, setTourTypesLoading] = React.useState<boolean>(true)
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)
  const session: Session | null = useAppSelector(state => state.sessionReducer.value)

  React.useEffect(() => {
    const fetchApi = async () => {
      setDestinationsLoading(true)
      const res = await getDestinations()
      if (res.code === 200) {
        setDestinations(JSON.parse(res.data!))
      } else {
        toast.error(res.message)
      }
      setDestinationsLoading(false)
    }
    fetchApi()
  }, [])

  React.useEffect(() => {
    const fetchApi = async () => {
      setTransportationsLoading(true)
      const res = await getTransportation()
      if (res.code === 200) {
        setTransportations(res.data!)
      } else {
        toast.error(res.message)
      }
      setTransportationsLoading(false)
    }
    fetchApi()
  }, [])

  React.useEffect(() => {
    const fetchApi = async () => {
      setTourTypesLoading(true)
      const res = await getTourType()
      if (res.code === 200) {
        setTourTypes(res.data!)
      } else {
        toast.error(res.message)
      }
      setTourTypesLoading(false)
    }
    fetchApi()
  }, [])


  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue,
    control
  } = useForm<ITourSchema>({
    defaultValues: {
      userId: session?.user._id!,
      tourName: "",
      destination: "",
      duration: "",
      price: 0,
      numberOfPeople: "",
      tourType: "",
      itinerary: [{
        time: "",
        action: "",
      }],
      accommodation: "",
      inclusions: [{ content: "" }],
      exclusions: [{ content: "" }],
      contactInformation: {
        name: "",
        email: "",
        phone: "",
        link: ""
      },
    },
    resolver: zodResolver(tourSchema),
  });

  const { fields: itineraryFields, append: itineraryAppend, remove: itineraryRemove } = useFieldArray({
    rules: {
      minLength: 1
    },
    control,
    name: "itinerary",
  },
  );

  const { fields: inclusionsFields, append: inclusionsAppend, remove: inclusionsRemove } = useFieldArray({
    rules: {
      minLength: 1
    },
    control,
    name: "inclusions",
  },
  );

  const { fields: exclusionsFields, append: exclusionsAppend, remove: exclusionsRemove } = useFieldArray({
    rules: {
      minLength: 1
    },
    control,
    name: "exclusions",
  },);

  const { fields: optionalActivitiesFields, append: optionalActivitiesAppend, remove: optionalActivitiesRemove } = useFieldArray({
    rules: {
      minLength: 0
    },
    control,
    name: "optionalActivities",
  },
  );

  const { fields: specialRequirementsFields, append: specialRequirementsAppend, remove: specialRequirementsRemove } = useFieldArray({
    rules: {
      minLength: 0
    },
    control,
    name: "specialRequirements",
  },
  );

  const onSubmit = async (data: ITourSchema) => {
    if (session) {
      setIsSubmitting(true)
      data.userId = session.user._id
      const res = await addTourism(session.user.accessToken, data)
      setIsSubmitting(false)
      if (res.code === 200) {
        toast.success(res.message)
      } else {
        toast.error(res.message)
      }
    }
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col gap-4'
      >
        <div
          className='flex flex-col gap-4 md:!flex-row items-baseline'
        >
          <div className='flex flex-col gap-4 w-full'>
            {/* Tên tour */}
            <Input
              isRequired
              label={"Tên tour"}
              placeholder='Nhập tên tour'
              {...register("tourName")}
              isInvalid={!!errors.tourName}
              errorMessage={errors?.tourName?.message}
            />

            {/* Điểm đến */}
            {
              destinationsLoading ? (
                <Skeleton className="h-[56px] w-full rounded-lg" />
              ) : (
                <Select
                  isRequired
                  label="Điểm đến"
                  placeholder="Chọn điểm đến"
                  className="max-w-full"
                  {...register("destination")}
                  isInvalid={!!errors.destination}
                  errorMessage={errors?.destination?.message}
                  disabledKeys={[""]}
                >
                  {
                    destinations.length > 0 ? (
                      destinations.map((item) => (
                        <SelectItem key={item._id} value={item._id}>
                          {item.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem key={""} value={""}>
                        Không có dữ liệu điểm đến
                      </SelectItem>
                    )
                  }
                </Select>
              )
            }


            {/* Thời gian */}
            <Input
              isRequired
              label={"Thời gian"}
              placeholder='Ví dụ: 3 ngày 2 đêm'
              {...register("duration")}
              isInvalid={!!errors.duration}
              errorMessage={errors?.duration?.message}
            />

            {/* Giá */}
            <Input
              isRequired
              label={"Giá tour"}
              placeholder='0'
              type='number'
              description="Giá trên 1 người, nhập là 0 nếu muốn thương lượng giá"
              {...register("price")}
              isInvalid={!!errors.price}
              errorMessage={errors?.price?.message}
            />

            {/* Số người */}
            <Input
              isRequired
              label={"Số người"}
              placeholder='Ví dụ: từ 10 đến 14 người'
              type='text'
              {...register("numberOfPeople")}
              isInvalid={!!errors.numberOfPeople}
              errorMessage={errors?.numberOfPeople?.message}
            />

            {/* Loại tour */}
            {
              tourTypesLoading ? (
                <Skeleton className="h-[56px] w-full rounded-lg" />
              ) : (
                <Select
                  isRequired
                  label="Loại tour"
                  placeholder="Chọn loại tour"
                  className="max-w-full"
                  {...register("tourType")}
                  isInvalid={!!errors.tourType}
                  errorMessage={errors?.tourType?.message}
                >
                  {
                    tourTypes.length > 0 ? (
                      tourTypes.map((item) => (
                        <SelectItem key={item._id} value={item._id}>
                          {item.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem key={""} value={""}>
                        Không có dữ liệu loại tour
                      </SelectItem>
                    )
                  }
                </Select>
              )
            }

            {/* Phương tiện di chuyển */}
            {
              transportationsLoading ? (
                <Skeleton className="h-[56px] w-full rounded-lg" />
              ) : (
                <Select
                  isRequired
                  selectionMode="multiple"
                  label="Phương tiện di chuyển"
                  placeholder="Chọn phương tiện"
                  description="Có thể chọn nhiều phương tiện"
                  className="max-w-full"
                  {...register("transportation")}
                  isInvalid={!!errors.transportation}
                  errorMessage={errors?.transportation?.message}
                >
                  {
                    transportations.length > 0 ? (
                      transportations.map((item) => (
                        <SelectItem key={item._id} value={item._id}>
                          {item.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem key={""} value={""}>
                        Không có dữ liệu phương tiện
                      </SelectItem>
                    )
                  }
                </Select>
              )
            }

            {/* Thông tin chổ ở */}
            <Input
              isRequired
              label="Thông tin chổ ở"
              description="Nhập 'đi về trong ngày' nếu tour chỉ kéo dài 1 ngày và không qua đêm"
              placeholder='Nhập thông tin chổ ở'
              {...register("accommodation")}
              isInvalid={!!errors.accommodation}
              errorMessage={errors?.accommodation?.message}
            />

            {/* Thông tin liên hệ */}
            <Card shadow="sm">
              <CardHeader>
                Thông tin liên hệ
              </CardHeader>
              <Divider />
              <CardBody className="flex flex-col gap-5">
                <Input
                  label="Tên"
                  isRequired
                  placeholder=''
                  {...register(`contactInformation.name`)}
                  isInvalid={!!errors.contactInformation}
                  errorMessage={errors?.contactInformation?.name?.message}
                />

                <Input
                  label="Email"
                  type='email'
                  placeholder=''
                  {...register(`contactInformation.email`)}
                  isInvalid={!!errors.contactInformation}
                  errorMessage={errors?.contactInformation?.email?.message}
                />

                <Input
                  label="Số điện thoại"
                  isRequired
                  type='text'
                  placeholder=''
                  {...register(`contactInformation.phone`)}
                  isInvalid={!!errors.contactInformation}
                  errorMessage={errors?.contactInformation?.phone?.message}
                />

                <Input
                  label="Liên kết đến trang đăng ký tour"
                  isRequired
                  type='text'
                  placeholder='Liên kết đến trang đăng ký tour'
                  {...register(`contactInformation.link`)}
                  isInvalid={!!errors.contactInformation}
                  errorMessage={errors?.contactInformation?.link?.message}
                />
              </CardBody>
            </Card>
          </div>

          <div className='flex flex-col gap-4 w-full'>
            {/* Hoạt động */}
            <Card shadow="sm">
              <CardHeader>
                Danh sách các hoạt động trong tour
              </CardHeader>
              <Divider />
              <CardBody className="flex flex-col gap-5">
                {
                  itineraryFields.map((field, i) => {
                    return (
                      <div key={field.id} className="flex flex-col gap-3">
                        <h4>Hoạt động: {i + 1}</h4>

                        <Select
                          isRequired
                          label="Thời gian"
                          placeholder="Chọn thời gian"
                          className="max-w-full"
                          {...register(`itinerary.${i}.time`)}
                          isInvalid={!!errors.itinerary}
                          errorMessage={errors?.itinerary?.message}
                        >
                          <SelectItem key={"Buổi sáng"} value={"Buổi sáng"}>
                            {"Buổi sáng"}
                          </SelectItem>
                          <SelectItem key={"Buổi trưa"} value={"Buổi trưa"}>
                            {"Buổi trưa"}
                          </SelectItem>
                          <SelectItem key={"Buổi chiều"} value={"Buổi chiều"}>
                            {"Buổi chiều"}
                          </SelectItem>
                          <SelectItem key={"Buổi tối"} value={"Buổi tối"}>
                            {"Buổi tối"}
                          </SelectItem>
                        </Select>

                        <div className='flex items-center gap-3'>

                          <Input
                            isRequired
                            placeholder='Hoạt động'
                            defaultValue={"Nhập hoạt động"}
                            {...register(`itinerary.${i}.action`)}
                            isInvalid={!!errors.itinerary}
                            errorMessage={errors?.itinerary?.message}
                          />

                          <Button
                            variant="flat"
                            color="danger"
                            onClick={() => itineraryRemove(i)}
                          >
                            Xoá
                          </Button>
                        </div>



                      </div>
                    )
                  })
                }
                <Button
                  variant="flat"
                  color="success"
                  onClick={() => itineraryAppend({
                    time: "Buổi sáng",
                    action: ""
                  })}
                >
                  Thêm hoạt động
                </Button>
              </CardBody>
            </Card>

            {/* Dịch vụ bao gồm */}
            <Card shadow="sm">
              <CardHeader>
                <span>
                  Dịch vụ bao gồm
                </span>
                <span className='text-rose-500'>*</span>
              </CardHeader>
              <Divider />
              <CardBody className="flex flex-col gap-5">
                {
                  inclusionsFields.map((field, i) => {
                    return (
                      <div key={field.id} className="flex flex-col gap-3">
                        <div className='flex items-center gap-3'>

                          <Input
                            isRequired
                            placeholder=''
                            {...register(`inclusions.${i}.content`)}
                            isInvalid={!!errors.inclusions}
                            errorMessage={errors?.inclusions?.message}
                          />

                          <Button
                            variant="flat"
                            color="danger"
                            onClick={() => inclusionsRemove(i)}
                          >
                            Xoá
                          </Button>
                        </div>
                      </div>
                    )
                  })
                }
                <Button
                  variant="flat"
                  color="success"
                  onClick={() => inclusionsAppend({
                    content: ""
                  })}
                >
                  Thêm
                </Button>
              </CardBody>
            </Card>

            {/* Dịch vụ không bao gồm */}
            <Card shadow="sm">
              <CardHeader>
                Dịch vụ không bao gồm
                <span className='text-rose-500'>*</span>
              </CardHeader>
              <Divider />
              <CardBody className="flex flex-col gap-5">
                {
                  exclusionsFields.map((field, i) => {
                    return (
                      <div key={field.id} className="flex flex-col gap-3">
                        <div className='flex items-center gap-3'>

                          <Input
                            isRequired
                            placeholder=''
                            {...register(`exclusions.${i}.content`)}
                            isInvalid={!!errors.exclusions}
                            errorMessage={errors?.exclusions?.message}
                          />

                          <Button
                            variant="flat"
                            color="danger"
                            onClick={() => exclusionsRemove(i)}
                          >
                            Xoá
                          </Button>
                        </div>
                      </div>
                    )
                  })
                }
                <Button
                  variant="flat"
                  color="success"
                  onClick={() => exclusionsAppend({
                    content: ""
                  })}
                >
                  Thêm
                </Button>
              </CardBody>
            </Card>

            {/* Các hoạt động tùy chọn */}
            <Card shadow="sm">
              <CardHeader>
                Các hoạt động tùy chọn
              </CardHeader>
              <Divider />
              <CardBody className="flex flex-col gap-5">
                {
                  optionalActivitiesFields.map((field, i) => {
                    return (
                      <div key={field.id} className="flex flex-col gap-3">
                        <div className='flex items-center gap-3'>

                          <Input
                            isRequired
                            placeholder=''
                            {...register(`optionalActivities.${i}.content`)}
                            isInvalid={!!errors.optionalActivities}
                            errorMessage={errors?.optionalActivities?.message}
                          />

                          <Button
                            variant="flat"
                            color="danger"
                            onClick={() => optionalActivitiesRemove(i)}
                          >
                            Xoá
                          </Button>
                        </div>
                      </div>
                    )
                  })
                }
                <Button
                  variant="flat"
                  color="success"
                  onClick={() => optionalActivitiesAppend({
                    content: ""
                  })}
                >
                  Thêm hoạt động
                </Button>
              </CardBody>
            </Card>

            {/* Yêu cầu đặc biệt */}
            <Card shadow="sm">
              <CardHeader>
                Yêu cầu đặc biệt
              </CardHeader>
              <Divider />
              <CardBody className="flex flex-col gap-5">
                {
                  specialRequirementsFields.map((field, i) => {
                    return (
                      <div key={field.id} className="flex flex-col gap-3">
                        <div className='flex items-center gap-3'>

                          <Input
                            isRequired
                            placeholder=''
                            {...register(`specialRequirements.${i}.content`)}
                            isInvalid={!!errors.specialRequirements}
                            errorMessage={errors?.specialRequirements?.message}
                          />

                          <Button
                            variant="flat"
                            color="danger"
                            onClick={() => specialRequirementsRemove(i)}
                          >
                            Xoá
                          </Button>
                        </div>
                      </div>
                    )
                  })
                }
                <Button
                  variant="flat"
                  color="success"
                  onClick={() => specialRequirementsAppend({
                    content: ""
                  })}
                >
                  Thêm yêu cầu
                </Button>
              </CardBody>
            </Card>

            {/* File mô tả */}
            <div className='w-full'>
              <div className='flex flex-row gap-3 items-center'>
                {
                  tourContracts.length > 0 ? (
                    tourContracts.map((contract, index) => {
                      return (
                        <Link
                          key={index}
                          href={contract}
                          isExternal
                        >
                          <Avatar
                            name={(index + 1).toString()}
                            size='sm'
                          />
                        </Link>
                      )
                    })
                  ) : (
                    <></>
                  )
                }
              </div>
              <UploadButton
                appearance={{
                  button:
                    "!h-[40px] !w-[200px] !rounded-large ut-ready:bg-green-500 ut-uploading:cursor-not-allowed bg-red-500 bg-none after:bg-orange-400",

                }}
                endpoint={'tourContracts'}
                onClientUploadComplete={(res) => {
                  const fileUrls: string[] = [];
                  if (res) {
                    for (let i = 0; i < res.length; i++) {
                      fileUrls.push(res?.[i].url);
                    }
                  }
                  setTourContracts(fileUrls);
                  setValue("tourContracts", fileUrls as [string, ...string[]])
                }}
                onUploadError={(error: Error) => {
                  console.log(error);
                }}
              />
            </div>
          </div>
        </div>

        <div className='flex gap-3 items-center justify-end'>
          <Button type='submit' color='success' isDisabled={isSubmitting || !session}>
            {
              isSubmitting && <Spinner size='sm' />
            }
            Gửi yêu cầu
          </Button>
        </div>
      </form>
    </div>
  )
}

export default React.memo(AddTourismsForm)