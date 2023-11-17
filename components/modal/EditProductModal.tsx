"use client"
import React from 'react'
import { Modal, ModalBody, ModalContent, ModalHeader, Skeleton } from '@nextui-org/react'
import { useSession } from 'next-auth/react'
import AddProductForm from '../form/AddProductForm'
import { IProduct } from '@/lib/models/products'
import toast from 'react-hot-toast'

type IProps = {
  isOpen: boolean;
  onClose?: () => void;
  onOpenChange: () => void;
  productId: string
}

const EditProductModal: React.FC<IProps> = ({ isOpen, onClose, onOpenChange, productId }) => {
  const { data: session } = useSession()
  const [productData, setProductData] = React.useState<IProduct | null>(null);
  const [isDataLoading, setIsDataLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const fetchApi = async () => {
      if (productId) {
        setIsDataLoading(true)
        const res = await fetch(`/api/products/product/${productId}`)
        if (res.ok) {
          const data: IProduct = await res.json()
          setProductData(data)
          setIsDataLoading(false)
        } else {
          toast.error("Lỗi lấy thông tin sản phẩm, vui lòng thử lại")
          setIsDataLoading(false)
          onClose!()
        }
      }
    }
    fetchApi()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="outside"
        size="5xl"
        placement="bottom"
        backdrop="opaque"
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
                Chỉnh sửa sản phẩm
              </ModalHeader>
              <ModalBody>
                {
                  isDataLoading ? (
                    <Skeleton className="w-full h-full rounded-lg" />
                  ) : (
                    <AddProductForm
                      session={session}
                      edit
                      productId={productId}
                      onClose={onClose}
                      productData={productData}
                    />
                  )
                }
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default EditProductModal