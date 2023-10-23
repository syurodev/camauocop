"use client";

import React from 'react'
import { Image } from '@nextui-org/react';
import { UseFormSetValue } from 'react-hook-form';

import { UploadDropzone, UploadButton } from '@/lib/uploadthing';

type IProps = {
  avatar: string
  setAvatar: React.Dispatch<React.SetStateAction<string>>
}

const AvatarUpload: React.FC<IProps> = ({
  avatar,
  setAvatar,
}) => {
  return (
    <div className="flex justify-center items-center gap-1 ">
      {avatar ? (
        <div className='flex flex-col items-center justify-center gap-3'>
          <div className="h-fit min-h-[200px] w-fit max-w-full min-w-[200px] rounded-md border !overflow-visible relative">
            <Image
              alt="Upload"
              src={avatar}
              width="100%"
              className="object-cover w-[200px] h-[200px]"
              radius='full'
            />
          </div>
          <UploadButton
            endpoint={'avatarImage'}
            onClientUploadComplete={(res) => {
              if (res) {
                setAvatar(res[0].url);
              }
            }}
            onUploadError={(error: Error) => {
              console.log(error);
            }}
          />
        </div>
      ) : (
        <UploadDropzone
          endpoint={'avatarImage'}
          onClientUploadComplete={(res) => {
            if (res) {
              setAvatar(res[0].url);
            }
          }}
          onUploadError={(error: Error) => {
            console.log(error);
          }}
        />
      )}
    </div>
  )
}

export default React.memo(AvatarUpload)