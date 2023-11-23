"use client"

import React, { useEffect, useState } from 'react'
import { Button, Card, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner, User } from '@nextui-org/react';
import { GoPlus } from "react-icons/go";
import { MdDone } from "react-icons/md";

import { searchUser } from '@/actions/user';
import useDebounce from '@/lib/hooks/useDebounce';
import { addStaff } from '@/actions/shop';
import { useAppSelector } from '@/redux/store';
import toast from 'react-hot-toast';

type IProps = {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: () => void;
  shopId: string,
}

const AddStaff: React.FC<IProps> = ({
  isOpen,
  onClose,
  onOpenChange,
  shopId,
}) => {
  const session = useAppSelector(state => state.sessionReducer.value)
  const [value, setValue] = useState<string>("")
  const [users, setUsers] = useState<{
    avatar: string,
    phone: string,
    username: string,
    status: "pd" | "ld" | "done",
    _id: string
  }[]>([])

  let debounced = useDebounce(value, 500);

  useEffect(() => {
    const fetchApi = async () => {
      const res = await searchUser(debounced, "individual")
      if (res.code === 200) {
        setUsers(res.data!.map(item => {
          return {
            avatar: item.avatar,
            phone: item.phone,
            username: item.username,
            status: "pd",
            _id: item._id,
          }
        }))
      } else {
        setUsers([])
      }
    }

    if (debounced && debounced !== "" && debounced.trim() !== "") {
      fetchApi()
    }
  }, [debounced])

  const updateUserStatus = (_id: string, newStatus: "pd" | "ld" | "done") => {
    const userIndex = users.findIndex((user) => user._id === _id);

    if (userIndex !== -1) {
      const updatedUsers = [...users];

      updatedUsers[userIndex] = {
        ...updatedUsers[userIndex],
        status: newStatus,
      };

      setUsers(updatedUsers);
    }
  };

  const handleAddStaff = async (_id: string) => {
    if (session) {
      updateUserStatus(_id, "ld")
      const res = await addStaff(session.user.accessToken, shopId, _id)

      if (res.code === 200) {
        toast.success(res.message)
        updateUserStatus(_id, "done")
      } else {
        toast.error(res.message)
        updateUserStatus(_id, "pd")
      }
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      backdrop="opaque"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Thêm nhân viên
            </ModalHeader>
            <ModalBody>
              <Input
                label="Tìm kiếm"
                placeholder='Nhập username, email, hoặc số điện thoại để tìm kiếm'
                value={value}
                onChange={e => setValue(e.target.value)}
              />

              <div className='flex flex-col items-start w-full gap-3'>
                {
                  users.length > 0 ? users.map(item => (
                    <Card
                      key={item._id}
                      shadow='sm'
                      className='p-3 flex flex-row items-center justify-between w-full'
                    >
                      <User
                        name={item.username}
                        description={item.phone !== "" ? item.phone : "Không có số điện thoại"}
                        avatarProps={{
                          src: item.avatar
                        }}
                      />

                      <Button
                        radius='full'
                        isIconOnly
                        size='sm'
                        color={item.status === "done" ? "success" : "default"}
                        isDisabled={item.status !== "pd"}
                        onPress={() => handleAddStaff(item._id)}
                      >
                        {
                          item.status === "pd" ? <GoPlus className="text-lg" /> : item.status === "ld" ? <Spinner size='sm' /> : <MdDone className="text-lg" />
                        }
                      </Button>
                    </Card>
                  )) : (
                    <p>Không có người dùng</p>
                  )
                }
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="bordered" onPress={onClose}>
                Đóng
              </Button>
              {/* <Button
                type='submit'
                isDisabled={isSubmitting}
                color={Array.from(shopStatus)[0] === "block" ? "danger" : "success"}
              >
                {
                  isSubmitting && <Spinner size='sm' />
                }
                Cập nhật
              </Button> */}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default AddStaff