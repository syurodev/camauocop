"use client"
import React from 'react'
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner, Textarea } from '@nextui-org/react';
import { z } from "zod";
import { useDispatch } from "react-redux"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast'

import { useAppSelector } from '@/redux/store';
import { addDestination, addTransportation } from '@/actions/tourisms';
import { IDestination } from '@/lib/models/destination';
import { pushDestination } from '@/redux/features/destination-slice';
import { ITransportation } from '@/lib/models/transportation';
import { pushTransportation } from '@/redux/features/transportation-slice';

type IProps = {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: () => void;
}

const AddTransportation: React.FC<IProps> = ({
  isOpen,
  onClose,
  onOpenChange,
}) => {
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)
  const dispactch = useDispatch()

  const TransportationSchema = z.object({
    name: z.string({ required_error: "Vui lòng nhập tên phương tiện" }),
    description: z.string().optional(),
  });

  type ITransportationSchema = z.infer<typeof TransportationSchema>;

  const {
    register,
    setValue,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<ITransportationSchema>({
    resolver: zodResolver(TransportationSchema),
  })

  const session = useAppSelector((state) => state.sessionReducer.value)

  const onSubmit = async (data: ITransportationSchema) => {
    setIsSubmitting(true)
    const res = await addTransportation(session?.user.accessToken!, data as ITransportation)
    setIsSubmitting(false)

    if (res.code === 200) {
      dispactch(pushTransportation(res.data!))
      toast.success(res.message)
      reset()
      onClose()
    } else {
      toast.error(res.message)
    }
  }

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='4xl'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Thêm phương tiện</ModalHeader>
                <ModalBody className='flex flex-col gap-3'>
                  <Input
                    isRequired
                    type="text"
                    label="Tên phương tiện"
                    variant="bordered"
                    className="max-w-full"
                    {...register("name")}
                    isInvalid={!!errors.name}
                    errorMessage={errors.name?.message}
                  />

                  <Textarea
                    label="Mô tả"
                    labelPlacement="inside"
                    placeholder="Nhập mô tả địa điểm"
                    className="max-w-full"
                    {...register("description")}
                    isInvalid={!!errors.description}
                    errorMessage={errors.description?.message}
                  />

                </ModalBody>
                <ModalFooter>
                  <Button variant="bordered" onPress={onClose}>
                    Đóng
                  </Button>
                  <Button color="success" type='submit' isDisabled={isSubmitting}>
                    {
                      isSubmitting && (
                        <Spinner size='sm' />
                      )
                    }
                    Thêm
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
export default AddTransportation