"use client"
import React from 'react'
import { Button, Card, CardBody, Tooltip, CardHeader, Divider, Select, SelectItem } from '@nextui-org/react'
import { MdOutlineLocationOn } from "react-icons/md"
import { Loader2 } from 'lucide-react';

import { getCurrentLocation, getGHNDistrict, getGHNProvince, getGHNWard } from '@/actions/address'

type IProps = {
}

const DeliveryCard: React.FC<IProps> = () => {
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
          if (res) {
            // res?.provinces && setProvinces(res?.provinces)
            res?.districts && setDistricts(res?.districts)
            res?.wards && setWards(res?.wards)
            res.province?.ProvinceID && setProvinceSelected(new Set([res.province?.ProvinceID.toString()]))
            res.district?.DistrictID && setDistrictSelected(new Set([res.district?.DistrictID.toString()]))
            res.ward?.WardCode && setWardSelected(new Set([res.ward?.WardCode.toString()]))
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
        Giao hàng
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
      </CardHeader>
      <Divider />
      <CardBody className='flex flex-col gap-3'>
        <Select
          isRequired
          label="Chọn Tỉnh/Thành phố"
          placeholder="Chọn Tỉnh/Thành phố"
          className="max-w-full"
          isDisabled={provinces?.data.length === 0}
          onChange={(e) => {
            setDistrictSelected(new Set([]))
            setWardSelected(new Set([]))
            setProvinceSelected(new Set([e.target.value]))
          }
          }
          selectionMode='single'
          selectedKeys={provinceSelected}

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
          onChange={(e) => {
            setWardSelected(new Set([]))
            setDistrictSelected(new Set([e.target.value]))
          }
          }
          selectionMode='single'
          selectedKeys={districtSelected}
        >
          {districts && districts?.data && districts?.data?.map((province) => {
            return (
              <SelectItem key={province.DistrictID} value={province.DistrictID}>
                {province.DistrictName}
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
          onChange={(e) => setWardSelected(new Set([e.target.value]))}
          selectionMode='single'
          selectedKeys={wardSelected}
        >
          {wards && wards?.data && wards?.data?.map((province) => {
            return (
              <SelectItem key={province.WardCode} value={province.WardCode}>
                {province.WardName}
              </SelectItem>
            )
          })}
        </Select>
      </CardBody>
    </Card>
  )
}
export default React.memo(DeliveryCard)
