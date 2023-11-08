"use client"
import React from 'react'
import { Button, Image, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner, Textarea } from '@nextui-org/react';
import { z } from "zod";
import { useDispatch } from "react-redux"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast'

import { UploadButton, UploadDropzone } from '@/lib/uploadthing';
import { useAppSelector } from '@/redux/store';
import { ISpecialty } from '@/lib/models/specialty';
import { pushSpecialty } from '@/redux/features/specialtys-slice';
import { addSpecialty } from '@/actions/specialty';
import Tiptap from '../elements/Editor';
import { DescriptionDataSchema } from '@/lib/zodSchema/products';

type IProps = {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: () => void;
}

const AddSpecialty: React.FC<IProps> = ({
  isOpen,
  onClose,
  onOpenChange,
}) => {
  const [images, setImages] = React.useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)
  const dispactch = useDispatch()

  const SpecialtySchema = z.object({
    name: z.string(),
    images: z.array(z.string().url(), { required_error: "Phải có ít nhất một hình ảnh" }),
    description: DescriptionDataSchema.optional(),
  });

  type ISpecialtySchema = z.infer<typeof SpecialtySchema>;

  const {
    register,
    setValue,
    getValues,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<ISpecialtySchema>({
    resolver: zodResolver(SpecialtySchema),
  })

  const session = useAppSelector((state) => state.sessionReducer.value)

  const onSubmit = async (data: ISpecialtySchema) => {
    setIsSubmitting(true)
    const res = await addSpecialty(session?.user.accessToken!, data as ISpecialty)
    setIsSubmitting(false)

    if (res.code === 200) {
      dispactch(pushSpecialty(res.data!))
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
                <ModalHeader className="flex flex-col gap-1">Thêm đặc sản</ModalHeader>
                <ModalBody className='flex flex-col gap-3'>

                  <div className="flex flex-col justify-center items-center gap-1 ">
                    {images ? (
                      <div className='flex flex-col items-center justify-center gap-3'>
                        <div
                          className='flex flex-row items-center justify-center gap-3'
                        >
                          {
                            images.map((image, index) => {
                              return (
                                <div
                                  key={index}
                                  className="h-fit min-h-[200px] w-fit max-w-full min-w-[200px] rounded-xl border !overflow-visible relative"
                                >
                                  <Image
                                    alt="image"
                                    src={image}
                                    width="100%"
                                    className="object-cover w-[200px] h-[200px]"
                                  />
                                </div>
                              )
                            })
                          }
                        </div>
                        <UploadButton
                          endpoint={'destinationImage'}
                          onClientUploadComplete={(res) => {
                            const fileUrls = [];
                            if (res) {
                              for (let i = 0; i < res.length; i++) {
                                fileUrls.push(res?.[i].url);
                              }
                            }
                            setImages(fileUrls)
                            setValue("images", fileUrls)
                          }}
                          onUploadError={(error: Error) => {
                            console.log(error);
                          }}
                        />
                      </div>
                    ) : (
                      <UploadDropzone
                        endpoint={'destinationImage'}
                        onClientUploadComplete={(res) => {
                          const fileUrls = [];
                          if (res) {
                            for (let i = 0; i < res.length; i++) {
                              fileUrls.push(res?.[i].url);
                            }
                          }
                          setImages(fileUrls);
                          setValue("images", fileUrls)
                        }}
                        onUploadError={(error: Error) => {
                          console.log(error);
                        }}
                      />
                    )}
                    {
                      errors.images && (
                        <span className='text-red-500'>{errors.images?.message}</span>
                      )
                    }
                  </div>

                  <Input
                    isRequired
                    type="text"
                    label="Tên đặc sản"
                    variant="bordered"
                    className="max-w-full"
                    {...register("name")}
                    isInvalid={!!errors.name}
                    errorMessage={errors.name?.message}
                  />

                  <p>Mô tả <span className='text-rose-500'>*</span></p>
                  <Tiptap getValues={getValues} setValue={setValue} initialValue={""} />

                  {errors.description && (
                    <p className="text-rose-500 font-bold">Phải có mô tả sản phẩm</p>
                  )}

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
export default React.memo(AddSpecialty)