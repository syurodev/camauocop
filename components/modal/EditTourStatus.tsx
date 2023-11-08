"use client"
import { changeTourStatus } from '@/actions/tourisms';
import { updateTourStatus } from '@/redux/features/tours-slice';
import { useAppSelector } from '@/redux/store';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Spinner, Textarea } from '@nextui-org/react';
import React from 'react'
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

type IProps = {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: () => void;
  tourId: string
}

const EditTourStatus: React.FC<IProps> = ({
  isOpen,
  onClose,
  onOpenChange,
  tourId,
}) => {
  const [value, setValue] = React.useState<Set<any>>(new Set([]));
  const [note, setNote] = React.useState<string>("");
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const session = useAppSelector(state => state.sessionReducer.value)
  const dispatch = useDispatch()

  const handleChangeStatus = async () => {
    setIsSubmitting(true)
    const res = await changeTourStatus(
      session?.user.accessToken!,
      tourId,
      Array.from(value)[0] as TourismsStatus,
      note
    )
    setIsSubmitting(false)
    if (res.code === 200) {
      dispatch(updateTourStatus({
        tourId: tourId,
        newStatus: Array.from(value)[0] as TourismsStatus
      }))
      toast.success(res.message)
      onClose()
    } else {
      toast.error(res.message)
    }
  }

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop='blur'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Chỉnh sửa trạng thái tour</ModalHeader>
              <ModalBody>
                <Select
                  label="Trạng thái tour"
                  variant="bordered"
                  placeholder="Chọn trạng thái tour"
                  selectedKeys={value}
                  className="max-w-full"
                  onSelectionChange={(key) => setValue(new Set([Array.from(key)[0]]))}
                >
                  <SelectItem key={"accepted"} value={"accepted"}>
                    Duyệt
                  </SelectItem>
                  <SelectItem key={"refuse"} value={"refuse"}>
                    Từ chối
                  </SelectItem>
                </Select>

                {
                  Array.from(value)[0] === "refuse" && (
                    <Textarea
                      isRequired
                      label="Lý do"
                      placeholder="Nhập lý do từ chối"
                      className="max-w-full"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                  )
                }
              </ModalBody>
              <ModalFooter>
                <Button variant="bordered" onPress={onClose}>
                  Đóng
                </Button>
                <Button
                  color={Array.from(value)[0] === "refuse" ? "danger" : "success"}
                  onPress={handleChangeStatus}
                  isDisabled={isSubmitting}
                >
                  {
                    isSubmitting && (
                      <Spinner size='sm' />
                    )
                  }
                  Lưu
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default React.memo(EditTourStatus)