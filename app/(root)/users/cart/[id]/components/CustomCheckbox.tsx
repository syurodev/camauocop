"use client"

import React from "react";
import { Checkbox, Link, User, Chip, cn } from "@nextui-org/react";

type IProps = {
  product: {
    name: string,
    image: string,
    username: string,
    role: string,
    shopurl: string,
    producturl: string,
    status: string,
  },
  statusColor: "default" | "primary" | "secondary" | "success" | "warning" | "danger",
  value: string
  disable: boolean
}

const CustomCheckbox: React.FC<IProps> = ({ product, statusColor, value, disable = false }) => {
  return (
    <Checkbox
      aria-label={product.name}
      classNames={{
        base: cn(
          "inline-flex !max-w-full lg:!max-w-[50%] w-full bg-content1 m-0",
          "hover:bg-content2 items-center justify-start",
          "cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
          "data-[selected=true]:border-primary"
        ),
        label: "w-full",
      }}
      value={value}
      isDisabled={disable}
    >
      <div className="w-full flex justify-between gap-2">
        <User
          avatarProps={{ size: "md", src: product.image }}
          description={
            <Link isExternal href={product.shopurl} size="sm">
              {product.username}
            </Link>
          }
          name={product.name}
        />
        <div className="flex flex-col items-end gap-1">
          <span className="text-tiny text-default-500">{product.role}</span>
          <Chip color={statusColor} size="sm" variant="flat">
            {product.status}
          </Chip>
        </div>
      </div>
    </Checkbox>
  );
};

export default CustomCheckbox