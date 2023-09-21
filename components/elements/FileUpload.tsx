"use client";

import React from "react";
import { UploadDropzone, UploadButton } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";
import Image from "next/image";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { X } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UseFormGetValues } from "react-hook-form";

interface FileUploadProps {
  getValue: UseFormGetValues<{
    productType: string;
    name: string;
    description: { time: number; blocks: unknown[]; version: string };
    price: number;
    quantity: number;
    images: [string, ...string[]];
    sellerId?: string | undefined;
    auction?: boolean | undefined;
  }>;
  endpoint: "productImages" | "avatarImage";
  setValue: (
    name:
      | "sellerId"
      | "productType"
      | "name"
      | "description"
      | "price"
      | "quantity"
      | "images"
      | "auction",
    value: any,
    options?: any
  ) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  getValue,
  endpoint,
  setValue,
}) => {
  const [images, setImages] = React.useState<string[]>([]);

  React.useEffect(() => {
    setImages(getValue("images"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex justify-center items-center gap-1 ">
      {images && images.length > 0 ? (
        <ScrollArea className="h-fit min-h-[200px] w-fit max-w-full min-w-[200px] rounded-md border !overflow-visible">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => {
                    setValue("images", []);
                    setImages(getValue("images"));
                  }}
                  className="bg-rose-500 text-white rounded-full p-1 absolute top-[-7px] right-[-7px] shadow-sm z-30"
                >
                  <X className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Xoá hình ảnh</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="flex space-x-4 py-4 justify-start ">
            {images.map((image, index) => (
              <Image
                key={index}
                alt="Upload"
                src={image}
                // Các thuộc tính khác cho Image
                width={200} // ví dụ
                height={200} // ví dụ
                className="rounded-md object-cover"
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      ) : (
        <UploadDropzone
          endpoint={endpoint}
          onClientUploadComplete={(res) => {
            const fileUrls = [];
            if (res) {
              for (let i = 0; i < res.length; i++) {
                fileUrls.push(res?.[i].url);
              }
            }
            // onChange(fileUrls);
            setValue("images", fileUrls);
            setImages(getValue("images"));
          }}
          onUploadError={(error: Error) => {
            console.log(error);
          }}
        />
      )}
    </div>
  );
};

export default FileUpload;
