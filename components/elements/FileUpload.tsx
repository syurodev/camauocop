"use client";

import React from "react";
import { UploadDropzone, UploadButton } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";
import Image from "next/image";
import { LuX } from "react-icons/lu"
import { UseFormGetValues } from "react-hook-form";
import { Tooltip, Button } from "@nextui-org/react";
import { IAddProductZodSchema } from "@/lib/zodSchema/products";

interface FileUploadProps {
  getValue: UseFormGetValues<IAddProductZodSchema>;
  endpoint: "productImages" | "avatarImage";
  setValue: (
    name:
      | "shopId"
      | "productType"
      | "name"
      | "description"
      | "quantity"
      | "images"
      | "retailPrice"
      | "retail"
      | "packageOptions",
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
        <div className="h-fit min-h-[200px] w-fit max-w-full min-w-[200px] rounded-md border !overflow-visible">
          <Tooltip content="Xoá hình ảnh">
            <Button
              variant="ghost"
              isIconOnly
              radius="full"
              onClick={() => {
                setValue("images", []);
                setImages(getValue("images"));
              }}
              className="bg-rose-500 border-none text-white rounded-full p-1 absolute top-[-7px] right-[-7px] shadow-sm z-30"
            >
              <LuX />
            </Button>
          </Tooltip>
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
        </div>
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
