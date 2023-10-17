"use client";

import React from "react";
import { TbInfoCircle } from "react-icons/tb"
import { Popover, PopoverTrigger, PopoverContent, Button } from "@nextui-org/react";

import AddProductForm from "@/components/form/AddProductForm";

type IProps = {
  sessionData: string
}

const AddProductWrapper: React.FC<IProps> = ({ sessionData }) => {
  const session = JSON.parse(sessionData)

  return (
    <>
      <div className="flex flex-row gap-2 items-center">
        <h1
          className="my-3 text-3xl font-bold"
        >
          THÊM SẢN PHẨM
        </h1>

        <Popover placement="bottom">
          <PopoverTrigger>
            <Button variant="ghost" isIconOnly className="border-none">
              <TbInfoCircle className="text-xl" />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="px-1 py-2">
              <p className="text-small pointer-events-none select-none">
                Chúng tôi sẻ thu
                <span className="ms-1 font-bold text-primary">
                  1% giá trị mỗi đơn hàng
                </span>
              </p>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <AddProductForm session={session} />
    </>
  );
};

export default AddProductWrapper;
