"use client"

import React from 'react'
import { Card, CardBody, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tab, Tabs } from '@nextui-org/react';

import ChangeAvatar from '../card/ChangeAvatar';
import ChangeShopInfo from '../card/ChangeShopInfo';

type IProps = {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: () => void;
  shopId: string,
}

const ShopStatus = [
  {
    value: "active",
    label: "Hoạt động"
  },
  {
    value: "block",
    label: "Bị khoá"
  }
]

const ShopSetting: React.FC<IProps> = ({
  isOpen,
  onClose,
  onOpenChange,
  shopId,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      backdrop="blur"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Cài đặt cửa hàng
            </ModalHeader>
            <ModalBody>
              <Tabs
                aria-label="Options"
                className='max-w-full flex flex-col justify-center'
              >
                <Tab key="avatar" title="Ảnh đại diện">
                  <ChangeAvatar onClose={onClose} />
                </Tab>
                <Tab key="info" title="Thông tin">
                  <ChangeShopInfo onClose={onClose} />
                </Tab>
              </Tabs>
            </ModalBody>
            <ModalFooter>

            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default React.memo(ShopSetting)