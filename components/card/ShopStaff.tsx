"use client"
import React, { useEffect, useState } from 'react'
import { Button, Card, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, User, useDisclosure } from '@nextui-org/react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux';
import { HiOutlineDotsVertical } from "react-icons/hi";
import { MdRemove } from "react-icons/md";
import { FiPlus } from "react-icons/fi";

import { useAppSelector } from '@/redux/store'
import AddStaff from '../modal/AddStaff';
import { changeStaffStatus, getStaffs } from '@/actions/shop';

type IProps = {
  onClose: () => void
  shopId: string
}

const ShopStaff: React.FC<IProps> = ({ onClose, shopId }) => {
  const session = useAppSelector(state => state.sessionReducer.value)
  const dispatch = useDispatch()
  const { isOpen, onOpen, onClose: onCloseAdd, onOpenChange } = useDisclosure()
  const [staffsData, setStaffsData] = useState<{
    staffId: string;
    staffStatus: StaffStatus;
    dateJoining: string;
    userDetails: {
      _id: string;
      username: string;
      phone: string;
      avatar: string;
    };
  }[]>([])

  useEffect(() => {
    const fetchApi = async () => {
      const res = await getStaffs(session?.user.accessToken!, shopId)

      if (res.code === 200) {
        setStaffsData(res.data!)
      } else {
        setStaffsData([])
      }
    }

    if (session && shopId) {
      fetchApi()
    }
  }, [shopId, session])

  const handleStaffStopWorking = async (staffId: string) => {
    if (session) {
      const res = await changeStaffStatus(session?.user.accessToken, shopId, staffId, "stopWorking")

      if (res.code === 200) {
        toast.success(res.message)
      } else {
        toast.error(res.message)
      }
    }
  }

  return (
    <>
      <div
        className='flex flex-col gap-3'
      >
        <div className='flex w-full justify-end'>
          <Button
            variant="flat"
            size='sm'
            color='success'
            startContent={
              <FiPlus className="text-lg" />
            }
            onPress={onOpen}
          >
            Thêm nhân viên
          </Button>
        </div>

        <div className='flex flex-col gap-3'>
          {
            staffsData.length > 0 ? staffsData.map((item) => {
              return (
                <Card
                  key={item.staffId}
                  className='p-2 flex flex-row items-center justify-between'
                  shadow='sm'
                >
                  <User
                    name={
                      <div className='flex flex-row items-center gap-3'>
                        <p>{item.userDetails.username}</p>
                        <Chip
                          size='sm'
                          variant='dot'
                          color={item.staffStatus === "pending" ? "warning" : item.staffStatus === "working" ? "success" : "default"}
                        >
                          {item.staffStatus === "pending" ? "Đang chờ" : item.staffStatus === "working" ? "Đang làm việc" : "Đã nghỉ"}
                        </Chip>
                      </div>
                    }
                    description={item.dateJoining}
                    avatarProps={{
                      src: item.userDetails.avatar
                    }}
                  />

                  <Dropdown placement="bottom">
                    <DropdownTrigger>
                      <Button
                        variant="flat"
                        isIconOnly
                        size='sm'
                        radius='full'
                        isDisabled={item.staffStatus === "stopWorking"}
                      >
                        <HiOutlineDotsVertical className="text-lg" />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      closeOnSelect
                      aria-label="Actions"
                      color="default"
                      variant="flat"
                    >
                      <DropdownItem
                        key="remove staff"
                        description="Xoá nhân viên"
                        color='danger'
                        startContent={<MdRemove className="text-lg" />}
                        onPress={() => handleStaffStopWorking(item.staffId)}
                      >
                        Nghỉ việc
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </Card>
              )
            }) : (
              <p>Không có nhân viên</p>
            )
          }

        </div>

        <div className='flex flex-row justify-end items-center gap-3'>
          <Button variant="bordered" onPress={onClose}>
            Đóng
          </Button>
          <Button
            // isDisabled={isSubmitting}
            color="success"
            type='submit'
          >
            {/* {
            isSubmitting && <Spinner size='sm' />
          } */}
            Cập nhật
          </Button>
        </div>
      </div>

      <AddStaff
        isOpen={isOpen}
        onClose={onCloseAdd}
        onOpenChange={onOpenChange}
        shopId={shopId}
      />
    </>
  )
}

export default React.memo(ShopStaff)