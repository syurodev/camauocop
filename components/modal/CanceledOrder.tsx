"use client"
import React from 'react'
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner, Textarea } from '@nextui-org/react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { canceledOrder } from '@/actions/order';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppSelector } from '@/redux/store';
import { updateOrderStatus } from '@/redux/features/orders-slice';

type IProps = {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: () => void;
  orderId: string
  onCloseDetailModal: () => void;
}


const CanceledOrder: React.FC<IProps> = ({
  isOpen,
  onClose,
  onOpenChange,
  orderId,
  onCloseDetailModal
}) => {

  const CanceledOrderSchema = z.object({
    note: z.string({ required_error: "Vui lòng nhập lý do" }),
  });

  type ICanceledOrderSchema = z.infer<typeof CanceledOrderSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICanceledOrderSchema>({
    resolver: zodResolver(CanceledOrderSchema),
  })

  const dispatch = useDispatch()
  const session = useAppSelector(state => state.sessionReducer.value)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const onSubmit = async (data: ICanceledOrderSchema) => {
    setIsLoading(true)

    const res = await canceledOrder(session?.user.accessToken!, orderId, data.note)
    setIsLoading(false)
    if (res.code === 200) {
      toast.success(res.message)
      dispatch(updateOrderStatus({
        orderId: orderId,
        newStatus: "canceled",
      }))
      onClose()
      onCloseDetailModal()
    } else {
      toast.error(res.message)
    }
  }

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Xác nhận huỷ đơn hàng #{orderId}
                </ModalHeader>
                <ModalBody>
                  <Textarea
                    isRequired
                    label="Lý do"
                    placeholder="Nhập lý do huỷ"
                    className="max-w-full"
                    {...register("note")}
                    isInvalid={!!errors.note}
                    errorMessage={errors.note?.message}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button variant="bordered" onPress={onClose}>
                    Đóng
                  </Button>
                  <Button color="danger" type='submit' isDisabled={isLoading}>
                    {
                      isLoading && (
                        <Spinner size='sm' />
                      )
                    }
                    Huỷ
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </form>
      </Modal>
    </>
  )
}

export default React.memo(CanceledOrder)