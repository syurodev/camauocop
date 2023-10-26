import { Image, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import React, { useState } from 'react'

type IProps = {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: () => void;
  images: string[]
}

const ImageView: React.FC<IProps> = ({
  isOpen,
  onClose,
  onOpenChange,
  images,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="flex flex-col gap-2">
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="outside"
        size="5xl"
        placement="bottom"
        backdrop="blur"
        isKeyboardDismissDisabled
        classNames={{
          base: "!max-w-[98%] !h-[95%] mx-2 !mb-0 !absolute !bottom-0 !rounded-b-none !overflow-auto"
        }}
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.2,
                ease: "easeOut",
              },
            },
            exit: {
              y: 20,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: "easeIn",
              },
            },
          }
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Xem hình ảnh
              </ModalHeader>
              <ModalBody>
                <Image
                  src={images[currentIndex]}
                  isZoomed
                  radius="lg"
                  width={"full"}
                  height={"auto"}
                  alt="comment image"
                  className="object-cover h-auto"
                />
              </ModalBody>
              <ModalFooter>
                <div className='flex flex-row gap-3 items-center justify-start h-40px mb-2'>
                  {
                    images.map((image, index) => {
                      return (
                        <Image
                          key={index}
                          src={image}
                          height={40}
                          width={40}
                          radius='full'
                          alt='comment image'
                          className='object-cover cursor-pointer'
                          onClick={() => setCurrentIndex(index)}
                        />
                      )
                    })
                  }
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default ImageView