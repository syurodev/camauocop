"use client";

import * as React from "react";
import { IProducts } from "@/lib/interface/interface";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";

interface CardItemProps {
  data: IProducts;
}

const CardItem: React.FC<CardItemProps> = ({ data }) => {
  const router = useRouter();

  let formattedPriceWithUnit = "";
  if (data.productPrice && !isNaN(data.productPrice)) {
    const formattedPrice = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(data.productPrice);

    formattedPriceWithUnit = `${formattedPrice}/Kg`;
  }

  return (
    <Card className="w-full min-w-[300px] max-w-[400px] h-[150px] relative m-auto overflow-hidden flex">
      <CardContent className="relative flex flex-col hover:w-full hover:absolute transition-all duration-150 z-10 w-2/5 justify-center items-center shadow-sm">
        <Link
          href={`/products/product/${data._id}`}
          className="cursor-pointer w-full h-[150px] relative object-cover overflow-hidden productImage"
        >
          <Image
            src={data.productImages[0]}
            alt="productImages"
            fill
            sizes="100%"
            style={{
              objectFit: "cover",
            }}
          />
        </Link>
      </CardContent>
      <CardFooter className="bg-inherit flex flex-col justify-between w-3/5 text-center items-center p-2 transition-all duration-150">
        <div>
          <p className="line-clamp-1 text-base uppercase font-semibold">
            {data.productName}
          </p>
          <p className="font-medium text-secondary-foreground opacity-80 select-none">
            {data.productTypeName}
          </p>
        </div>
        <div className="w-fit mt-2">
          <p className="px-2 py-1 rounded-full bg-secondary text-white">
            {formattedPriceWithUnit}
          </p>
        </div>
        <div className="flex justify-between items-center w-full">
          {/* TODO: Thêm vào danh sách yêu thích */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="rounded-full"
                  size={"icon"}
                  variant={"outline"}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                    />
                  </svg>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Thêm vào danh sách yêu thích</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* TODO: Thêm vào giỏ hàng */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="rounded-full"
                  size={"icon"}
                  variant={"outline"}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                    />
                  </svg>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Thêm vào giỏ hàng</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CardItem;
