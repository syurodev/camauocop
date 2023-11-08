"use client"
import React from 'react'
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner } from '@nextui-org/react';
import { z } from "zod";
import { useDispatch } from "react-redux"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast'

import { useAppSelector } from '@/redux/store';
import { addTourType } from '@/actions/tourisms';
import { ITourType } from '@/lib/models/tourType';
import { pushTourType } from '@/redux/features/tour-type-slice';

type IProps = {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: () => void;
}

const AddTourType: React.FC<IProps> = ({
  isOpen,
  onClose,
  onOpenChange,
}) => {
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)
  const dispactch = useDispatch()

  const TourTypeSchema = z.object({
    name: z.string({ required_error: "Vui lòng nhập tên loại tour" }),
  });

  type ITourTypeSchema = z.infer<typeof TourTypeSchema>;

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<ITourTypeSchema>({
    resolver: zodResolver(TourTypeSchema),
  })

  const session = useAppSelector((state) => state.sessionReducer.value)

  const onSubmit = async (data: ITourTypeSchema) => {
    setIsSubmitting(true)
    const res = await addTourType(session?.user.accessToken!, data as ITourType)
    setIsSubmitting(false)

    if (res.code === 200) {
      dispactch(pushTourType(res.data!))
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
                <ModalHeader className="flex flex-col gap-1">Thêm loại tour</ModalHeader>
                <ModalBody className='flex flex-col gap-3'>
                  <Input
                    isRequired
                    type="text"
                    label="Tên loại tour"
                    variant="bordered"
                    className="max-w-full"
                    {...register("name")}
                    isInvalid={!!errors.name}
                    errorMessage={errors.name?.message}
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
export default AddTourType