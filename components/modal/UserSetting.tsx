"use client"
import React from 'react'
import { Modal, ModalBody, ModalContent, ModalHeader, Tab, Tabs } from '@nextui-org/react';
import ChangeAvatar from '../card/ChangeAvatar';
import ChangeUserInfo from '../card/ChangeUserInfo';

type IProps = {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: () => void;
}

const UserSetting: React.FC<IProps> = ({
  isOpen,
  onClose,
  onOpenChange,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      backdrop="opaque"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Cài đặt tài khoản
            </ModalHeader>
            <ModalBody>
              <Tabs
                aria-label="Options"
                className='max-w-full flex flex-col justify-center'
              >
                <Tab key="avatar" title="Ảnh đại diện">
                  <ChangeAvatar onClose={onClose} role='user' />
                </Tab>
                <Tab key="info" title="Thông tin">
                  <ChangeUserInfo onClose={onClose} />
                </Tab>
              </Tabs>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default React.memo(UserSetting)