import React from 'react'
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react'
import { useSession } from 'next-auth/react'
import { deleteProduct } from '@/actions/products';
import toast from 'react-hot-toast';

type IProps = {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: () => void;
  label: string;
  future: "delete product";
  content: string
  id: string;
}

const DeleteConfirmModal: React.FC<IProps> = ({
  isOpen,
  onClose,
  onOpenChange,
  label,
  future,
  content,
  id
}) => {

  const { data: session } = useSession()

  const handleDelete = async () => {
    if (future === "delete product") {
      const res = await deleteProduct(id, session?.user.accessToken || "")
      if (res.code === 200) {
        toast.success(res.message)
        onClose()
      } else {
        toast.success(res.message)
      }
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={false}
      placement="center"
      backdrop="blur"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              {label}
            </ModalHeader>
            <ModalBody>
              {content}
            </ModalBody>
            <ModalFooter>
              <Button
                variant="bordered"
                onPress={() => onClose()}
              >
                Huỷ
              </Button>
              <Button
                color="danger"
                onPress={handleDelete}
              >
                Xác nhận
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
export default DeleteConfirmModal