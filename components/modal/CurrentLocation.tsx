"use client";

import React from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import { Loader2 } from 'lucide-react';

import { getCurrentLocation } from '@/actions/address';

type IProps = {
  isOpen: boolean;
  onClose?: () => void;
  onOpenChange: () => void;
}

const CurrentLocation: React.FC<IProps> = ({ isOpen, onClose, onOpenChange }) => {
  const [geolocation, setGeolocation] = React.useState<IGeolocation | null>(null);
  const [isGeolocationAvailable, setIsGeolocationAvailable] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (isOpen) {
      if ("geolocation" in navigator) {
        setIsGeolocationAvailable(true);

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const res = await getCurrentLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            })
            setGeolocation(res)
          },
          (error) => {
            console.error("Lỗi khi lấy vị trí hiện tại: ", error);
          }
        );
      } else {
        setIsGeolocationAvailable(false);
      }
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      placement={'center'}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Vị trí hiện tại</ModalHeader>
            <ModalBody>
              {
                geolocation ? (
                  <p>{geolocation?.display_name} </p>
                ) : (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )
              }
            </ModalBody>
            <ModalFooter>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
export default CurrentLocation