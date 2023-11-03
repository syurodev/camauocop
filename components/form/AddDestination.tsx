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
import { addDestination } from '@/actions/tourisms';
import { IDestination } from '@/lib/models/destination';
import { pushDestination } from '@/redux/features/destination-slice';

type IProps = {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: () => void;
}

const AddDestination: React.FC<IProps> = ({
  isOpen,
  onClose,
  onOpenChange,
}) => {
  const [images, setImages] = React.useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)
  const dispactch = useDispatch()

  const DestinationSchema = z.object({
    name: z.string(),
    images: z.array(z.string().url()),
    description: z.string(),
  });

  type IDestinationSchema = z.infer<typeof DestinationSchema>;

  const {
    register,
    setValue,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<IDestinationSchema>({
    resolver: zodResolver(DestinationSchema),
  })

  const session = useAppSelector((state) => state.sessionReducer.value)

  const onSubmit = async (data: IDestinationSchema) => {
    setIsSubmitting(true)
    const res = await addDestination(session?.user.accessToken!, data as IDestination)
    setIsSubmitting(false)

    if (res.code === 200) {
      dispactch(pushDestination(res.data!))
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
                <ModalHeader className="flex flex-col gap-1">Thêm địa điểm</ModalHeader>
                <ModalBody className='flex flex-col gap-3'>

                  <div className="flex justify-center items-center gap-1 ">
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
                  </div>

                  <Input
                    isRequired
                    type="text"
                    label="Tên địa điểm"
                    variant="bordered"
                    className="max-w-full"
                    {...register("name")}
                    isInvalid={!!errors.name}
                    errorMessage={errors.name?.message}
                  />

                  <Textarea
                    isRequired
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
                  <Button variant="light" onPress={onClose}>
                    Close
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
export default AddDestination