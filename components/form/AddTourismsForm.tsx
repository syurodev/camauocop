"use client"

import React from 'react'
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, CardBody, CardHeader, Divider, Input, Select, SelectItem, Skeleton } from '@nextui-org/react';

import { ITourSchema, tourSchema } from '@/lib/zodSchema/tourSchema';
import Tiptap from '../elements/Editor';
import { TourType } from '@/lib/constant/TourType';
import { transportation } from '@/lib/constant/Transportation';
import { getDestinations } from '@/actions/tourisms';
import toast from 'react-hot-toast';

const AddTourismsForm = () => {
  const [destinations, setDestinations] = React.useState<DestinationData[]>([])
  const [destinationsLoading, setDestinationsLoading] = React.useState<boolean>(true)

  React.useEffect(() => {
    const fetchApi = async () => {
      setDestinationsLoading(true)
      const res = await getDestinations()
      if (res.code === 200) {
        setDestinations(res.data!)
      } else {
        toast.error(res.message)
      }
      setDestinationsLoading(false)
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
      tourName: "",
      description: {
        type: "",
        content: []
      },
      destination: "",
      duration: "",
      price: 0,
      numberOfPeople: "",
      tourType: "",
      itinerary: [{
        time: "",
        action: "",
      }],
      transportation: "",
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
  },
  );

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
    console.log(data)
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col gap-3'
      >
        {/* Tên tour */}
        <Input
          isRequired
          label={"Tên tour"}
          placeholder='Nhập tên tour'
          {...register("tourName")}
          isInvalid={!!errors.tourName}
          errorMessage={errors?.tourName?.message}
        />

        <p>Mô tả</p>
        <Tiptap getValues={getValues} setValue={setValue} />

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
                    <SelectItem key={item.name} value={item.name}>
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
        <Select
          isRequired
          label="Loại tour"
          placeholder="Chọn loại tour"
          className="max-w-full"
          {...register("tourType")}
          isInvalid={!!errors.tourType}
          errorMessage={errors?.tourType?.message}
        >
          {TourType.map((tour) => (
            <SelectItem key={tour.label} value={tour.label}>
              {tour.label}
            </SelectItem>
          ))}
        </Select>

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

        {/* Phương tiện di chuyển */}
        <Select
          isRequired
          label="Phương tiện di chuyển"
          placeholder="Chọn phương tiện"
          className="max-w-full"
          {...register("transportation")}
          isInvalid={!!errors.transportation}
          errorMessage={errors?.transportation?.message}
        >
          {transportation.map((item) => (
            <SelectItem key={item.name} value={item.name}>
              {item.name}
            </SelectItem>
          ))}
        </Select>

        {/* Thông tin chổ ở */}
        <Input
          isRequired
          label="Thông tin chổ ở"
          placeholder='Nhập thông tin chổ ở'
          {...register("accommodation")}
          isInvalid={!!errors.accommodation}
          errorMessage={errors?.accommodation?.message}
        />

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

        <div className='flex gap-3 items-center justify-end'>
          <Button type='submit' color='success'>
            Gửi yêu cầu
          </Button>
        </div>
      </form>
    </div>
  )
}

export default React.memo(AddTourismsForm)