"use client"

import React from 'react'
import { Modal, ModalBody, ModalContent, ModalHeader, Tab, Tabs } from '@nextui-org/react';

import ChangeAvatar from '../card/ChangeAvatar';
import ChangeShopInfo from '../card/ChangeShopInfo';
import ShopStaff from '../card/ShopStaff';

type IProps = {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: () => void;
  shopId: string,
}

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
      backdrop="opaque"
      size='2xl'
    >
      <ModalContent className='max-h-[80%] overflow-auto'>
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
                  <ChangeAvatar onClose={onClose} role='shop' />
                </Tab>
                <Tab key="info" title="Thông tin">
                  <ChangeShopInfo onClose={onClose} />
                </Tab>
                <Tab key="staffs" title="Nhân viên">
                  <ShopStaff onClose={onClose} shopId={shopId} />
                </Tab>
              </Tabs>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default React.memo(ShopSetting)