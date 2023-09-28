"use client"
import React from 'react'
import { Button, Card, CardBody, Tooltip, Input, CardHeader, Avatar, Divider, Select, SelectItem, CardFooter } from '@nextui-org/react'
import { MdOutlineLocationOn } from "react-icons/md"
import { BsListNested } from "react-icons/bs"
import { Loader2 } from 'lucide-react';
import toast from "react-hot-toast";

import { getCurrentLocation, getGHNDistrict, getGHNProvince, getGHNWard } from '@/actions/address'
import { UseFormRegisterReturn } from 'react-hook-form'

type IProps = {
  selectionMode: "multiple" | "single" | "none"
  label: string
  showList?: boolean
  registerApartment?: UseFormRegisterReturn<"apartment">
  registerDelivery?: UseFormRegisterReturn<"delivery">
  registerProvince?: UseFormRegisterReturn<"province">
  registerDistrict?: UseFormRegisterReturn<"district">
  registerWard?: UseFormRegisterReturn<"ward">
  errors?: any
  getValues?: any,
  setValue?: any,
  setProvinceId: React.Dispatch<React.SetStateAction<number>>,
  setDistrictId: React.Dispatch<React.SetStateAction<number>>,
  setWardId: React.Dispatch<React.SetStateAction<string>>,
}

const DeliveryCard: React.FC<IProps> = ({
  selectionMode = "single",
  label,
  showList = false,
  registerApartment,
  registerDelivery,
  registerProvince,
  registerDistrict,
  registerWard,
  errors,
  getValues,
  setValue,
  setProvinceId,
  setDistrictId,
  setWardId
}) => {
  const [provinces, setProvinces] = React.useState<GHNApiProvinceResponse>({
    code: 0,
    message: "",
    data: []
  })
  const [districts, setDistricts] = React.useState<GHNApiDistrictResponse>({
    code: 0,
    message: "",
    data: []
  })
  const [wards, setWards] = React.useState<GHNApiWardResponse>({
    code: 0,
    message: "",
    data: []
  })

  const [provinceSelected, setProvinceSelected] = React.useState<Set<any>>(new Set([]))
  const [districtSelected, setDistrictSelected] = React.useState<Set<any>>(new Set([]))
  const [wardSelected, setWardSelected] = React.useState<Set<any>>(new Set([]))
  const [isGeolocationAvailable, setIsGeolocationAvailable] = React.useState<boolean>(false);
  const [isGeolocationLoading, setIsGeolocationLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    const fetchApi = async () => {
      const data: GHNApiProvinceResponse = await getGHNProvince()
      if (data.code === 500) {
        toast.error(data.message);
        return
      }
      if (data.code === 200) {
        setProvinces(data)
      }
    }
    fetchApi()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    const fetchApi = async () => {
      if (Array.from(provinceSelected)[0]) {
        const data: GHNApiDistrictResponse = await getGHNDistrict(+Array.from(provinceSelected)[0])
        if (data.code === 500) {
          toast.error(data.message);
          return
        }
        if (data.code === 200) {
          setDistricts(data)
        }
      }
    }
    fetchApi()
  }, [provinceSelected])

  React.useEffect(() => {
    const fetchApi = async () => {
      if (Array.from(districtSelected)[0]) {
        const data: GHNApiWardResponse = await getGHNWard(+Array.from(districtSelected)[0])
        if (data.code === 500) {
          toast.error(data.message);
          return
        }
        if (data.code === 200) {
          setWards(data)
        }
      }
    }
    fetchApi()
  }, [districtSelected])

  const handleAutoLocation = async () => {
    if ("geolocation" in navigator) {
      setIsGeolocationAvailable(true);
      setIsGeolocationLoading(true)
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const res = await getCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
          if (res && res.code === 500) {
            toast.error(res?.message || "Có lỗi trong quá trình tự động định vị. Vui lòng chọn thủ công");
            setIsGeolocationLoading(false)
            return
          }
          if (res?.code === 200) {
            // res?.provinces && setProvinces(res?.provinces)
            res?.districts && setDistricts(res?.districts)
            res?.wards && setWards(res?.wards)
            res.province?.ProvinceID && setProvinceSelected(new Set([res.province?.ProvinceID.toString()]))
            res.province?.ProvinceID && setProvinceId(res.province?.ProvinceID)
            res.province?.ProvinceName && setValue("province", res.province?.ProvinceName)
            res.district?.DistrictID && setDistrictSelected(new Set([res.district?.DistrictID.toString()]))
            res.district?.DistrictID && setDistrictId(res.district?.DistrictID)
            res.district?.DistrictName && setValue("district", res.district?.DistrictName)
            res.ward?.WardCode && setWardSelected(new Set([res.ward?.WardCode.toString()]))
            res.ward?.WardCode && setWardId(res.ward?.WardCode)
            res.ward?.WardCode && setValue("ward", res.ward?.WardName)
            setIsGeolocationLoading(false)
          }
        },
        (error) => {
          console.error("Lỗi khi lấy vị trí hiện tại: ", error);
        }
      );
    } else {
      setIsGeolocationAvailable(false);
    }
  }

  return (
    <Card shadow="sm">
      <CardHeader className='flex justify-between items-center'>
        {label}
        <div className='flex flex-row items-center'>
          <Tooltip content="Lấy vị trí tự động">
            <Button
              variant='ghost'
              isIconOnly
              radius='full'
              className='border-none'
              onPress={handleAutoLocation}
            >
              {
                isGeolocationLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <MdOutlineLocationOn className="text-xl" />
                )
              }
            </Button>
          </Tooltip>

          {
            showList && <Tooltip content="Danh sách vị trí">
              <Button
                variant='ghost'
                isIconOnly
                radius='full'
                className='border-none'
              >
                <BsListNested className="text-xl" />
              </Button>
            </Tooltip>
          }

        </div>
      </CardHeader>

      <Divider />

      <CardBody className='flex flex-col gap-3'>
        {/* TODO:chọn đơn vị vận chuyển */}
        <Select
          // items={users}
          isRequired
          label="Chọn đơn vị vận chuyển"
          placeholder="Chọn đơn vị vận chuyển"
          labelPlacement="inside"
          selectionMode={selectionMode}
          isInvalid={!!errors.delivery}
          errorMessage={errors.delivery?.message}
          classNames={{
            base: "max-w-full",
            trigger: "h-12",
          }}
          renderValue={(items: any) => {
            return <div className='flex gap-2 overflow-hidden'>
              {
                items.map((item: any) => (
                  <div key={item.key} className="flex items-center gap-2">
                    <Avatar
                      alt={"GHN"}
                      className="flex-shrink-0 object-cover w-5 h-5 text-tiny"
                      src={"/images/GHN.png"}
                    />
                    <div className="flex flex-col">
                      <span>Giao hàng nhanh</span>
                    </div>
                  </div>
                ))
              }
            </div>

          }
          }
          {...registerDelivery}
          onChange={e => {
            const arrayDelivery = e.target.value.split(', ');
            setValue("delivery", arrayDelivery)
          }}
        >
          {/* {(user) => ( */}
          <SelectItem
            key={"Giao hàng nhanh"}
            textValue="Giao hàng nhanh"
          >
            <div className="flex gap-2 items-center">
              <Avatar alt={"Giao hàng nhanh"} className="flex-shrink-0 object-cover" size="sm" src={"/images/GHN.png"} />
              <div className="flex flex-col">
                <span className="text-small">{"Giao hàng nhanh"}</span>
              </div>
            </div>
          </SelectItem>
          {/* )} */}
        </Select>

        <Select
          isRequired
          label="Chọn Tỉnh/Thành phố"
          placeholder="Chọn Tỉnh/Thành phố"
          className="max-w-full"
          isDisabled={provinces?.data.length === 0}
          selectionMode='single'
          selectedKeys={provinceSelected}
          {...registerProvince}
          isInvalid={!!errors.province}
          errorMessage={errors.province?.message}
          onChange={(e) => {
            setDistrictSelected(new Set([]))
            setWardSelected(new Set([]))
            setProvinceSelected(new Set([e.target.value]))
            setProvinceId(+e.target.value || 0)
            const selectedProvinceName = provinces.data.find(province => province.ProvinceID === +e.target.value)
            const provinceName = selectedProvinceName ? selectedProvinceName.ProvinceName : "";
            setValue("province", provinceName)
          }
          }
        >
          {provinces && provinces?.data && provinces?.data?.map((province) => {
            return (
              <SelectItem key={province.ProvinceID} value={province.ProvinceID}>
                {province.ProvinceName}
              </SelectItem>
            )
          })}
        </Select>

        <Select
          isRequired
          label="Chọn Quận/Huyện"
          placeholder="Chọn Quận/Huyện"
          className="max-w-full"
          isDisabled={districts?.data.length === 0}
          selectionMode='single'
          selectedKeys={districtSelected}
          {...registerDistrict}
          isInvalid={!!errors.district}
          errorMessage={errors.district?.message}
          onChange={(e) => {
            setWardSelected(new Set([]))
            setDistrictSelected(new Set([e.target.value]))
            setDistrictId(+e.target.value)
            const selectedDistrictName = districts.data.find(district => district.DistrictID === +e.target.value)
            const districtName = selectedDistrictName ? selectedDistrictName.DistrictName : "";
            setValue("district", districtName)
          }
          }
        >
          {districts && districts?.data && districts?.data?.map((district) => {
            return (
              <SelectItem key={district.DistrictID} value={district.DistrictID}>
                {district.DistrictName}
              </SelectItem>
            )
          })}
        </Select>

        <Select
          isRequired
          label="Chọn Phường/Xã"
          placeholder="Chọn Phường/Xã"
          className="max-w-full"
          isDisabled={wards?.data.length === 0}
          selectionMode='single'
          selectedKeys={wardSelected}
          {...registerWard}
          isInvalid={!!errors.ward}
          errorMessage={errors.ward?.message}
          onChange={(e) => {
            setWardSelected(new Set([e.target.value]))
            setWardId(e.target.value)
            const selectedWardName = wards.data.find(ward => ward.WardCode === e.target.value)
            const wardName = selectedWardName ? selectedWardName.WardName : "";
            setValue("ward", wardName)
          }
          }
        >
          {wards && wards?.data && wards?.data?.map((province) => {
            return (
              <SelectItem key={province.WardCode} value={province.WardCode}>
                {province.WardName}
              </SelectItem>
            )
          })}
        </Select>

        <Input
          isRequired
          type="text"
          label="Số nhà"
          placeholder="Nhập số nhà của bạn"
          {...registerApartment}
          isInvalid={!!errors.apartment}
          errorMessage={errors.apartment?.message}
        />
      </CardBody>
    </Card>
  )
}
export default React.memo(DeliveryCard)
