'use client'

import React from 'react'
import { UploadDropzone, UploadButton } from '@/lib/uploadthing';
import "@uploadthing/react/styles.css"
import Image from 'next/image';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { X } from 'lucide-react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface FileUploadProps {
  onChange: (url?: string | string[]) => void;
  value: string[];
  enpoint: "productImages" | "avatarImage"
}

const FileUpload: React.FC<FileUploadProps> = ({
  onChange, value, enpoint
}) => {
  return (
    <div className='flex justify-center items-center gap-1 '>
      {
        value && value.length > 0 ?
          (
            <ScrollArea className="h-fit min-h-[200px] w-fit max-w-full min-w-[200px] rounded-md border !overflow-visible">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => onChange([])}
                      className='bg-rose-500 text-white rounded-full p-1 absolute top-[-7px] right-[-7px] shadow-sm z-30'
                    >
                      <X className='h-4 w-4' />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Xoá hình ảnh</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div className="flex space-x-4 py-4 justify-start ">
                {
                  value.map((image, index) => (
                    <Image
                      key={index}
                      alt='Upload'
                      src={image}
                      // Các thuộc tính khác cho Image
                      width={200} // ví dụ
                      height={200} // ví dụ
                      className='rounded-md object-cover'
                    />
                  ))
                }
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          )
          :
          (<UploadDropzone
            endpoint={enpoint}
            onClientUploadComplete={(res) => {
              const fileUrls = [];
              if (res) {
                for (let i = 0; i < res.length; i++) {
                  fileUrls.push(res?.[i].url);
                }
              }
              onChange(fileUrls)
            }}
            onUploadError={(error: Error) => {
              console.log(error)
            }}
          />)}
    </div>
  )
}

export default FileUpload
