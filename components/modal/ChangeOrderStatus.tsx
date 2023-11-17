"use client"

import React from 'react'
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectSection, SelectItem, Selection } from '@nextui-org/react';

import { OrderStatus } from "@/lib/constant/OrderStatus"
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/redux/store';
import { updateOrderStatus } from '@/redux/features/orders-slice';
import { changeOrderStatus } from '@/actions/order';
import toast from 'react-hot-toast';

type IProps = {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: () => void;
  orderId: string,
  orderStatus: OrderStatus
}

const ChangeOrderStatus: React.FC<IProps> = ({
  isOpen,
  onClose,
  onOpenChange,
  orderId,
  orderStatus
}) => {
  const [value, setValue] = React.useState<Selection>(new Set([]));
  const dispatch = useDispatch()
  const session = useAppSelector(state => state.sessionReducer.value)

  const handleChangeOrderStatus = async () => {
    const res = await changeOrderStatus(session?.user.accessToken!, orderId, Array.from(value)[0] as OrderStatus, orderStatus)
    if (res.code === 200) {
      toast.success(res.message)
      dispatch(updateOrderStatus({
        orderId,
        newStatus: Array.from(value)[0] as OrderStatus
      }))
      onClose()
    } else {
      toast.error(res.message)
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
              Thay đổi trạng thái đơn hàng
            </ModalHeader>
            <ModalBody>
              <Select
                label="Chọn trạng thái đơn hàng"
                variant="bordered"
                placeholder="Chọn trạng thái đơn hàng"
                selectedKeys={value}
                className="max-w-full"
                disabledKeys={orderStatus === 'shipped' ? ["shipped"] : orderStatus === 'delivered' ? ["shipped", "delivered"] : [""]}
                onSelectionChange={setValue}
              >
                {OrderStatus.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </Select>
            </ModalBody>
            <ModalFooter>
              <Button variant="bordered" onPress={onClose}>
                Đóng
              </Button>
              <Button color={`${Array.from(value)[0] === "canceled" ? "danger" : "success"}`} onPress={handleChangeOrderStatus}>
                Cập nhật
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default React.memo(ChangeOrderStatus)