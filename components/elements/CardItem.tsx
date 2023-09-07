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

  const handleClick = () => {
    router.push(`/products/product/${data._id}`);
  };

  return (
    <Card
      className="text-white min-w-[230px] max-w-[250px] h-[250px] relative 
    shadow-md m-auto overflow-hidden"
    >
      <CardContent className="relative flex flex-col justify-center items-center">
        <div className="flex justify-between items-center w-full absolute p-2 top-0 z-30">
          {/* TODO: Chuyển đến trang profile */}
          <Avatar className="shadow-md shadow-black/50 cursor-pointer">
            <AvatarImage src={data.sellerAvatar} alt={data.sellerName} />
            <AvatarFallback>{data.sellerName}</AvatarFallback>
          </Avatar>

          {/* TODO: Thêm vào giỏ hàng */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="rounded-full bg-lightgreen shadow-sm shadow-black/50"
                  size={"icon"}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="white"
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

        <div
          className="cursor-pointer w-full h-[250px] relative object-cover overflow-hidden rounded-md productImage"
          onClick={handleClick}
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
        </div>
      </CardContent>
      <CardFooter className="absolute bottom-0 left-0 right-0 top-[65%] shadow-md">
        <div className="absolute z-10 flex flex-col justify-between items-center w-full h-full">
          <h4
            className="font-medium mt-1 line-clamp-1 px-2 cursor-pointer"
            onClick={handleClick}
          >
            {data.productName}
          </h4>
          <h5 className="text-white/80">{data.productTypeName}</h5>

          <h5 className="select-none font-medium py-1 px-2 mb-2 bg-lightgreen text-white rounded-full">
            {formattedPriceWithUnit}
          </h5>
        </div>

        <div
          className="w-full h-full dark:bg-slate-950/50 backdrop-blur-xl
        transition-colors duration-150 rounded-s-md rounded-e-md"
        ></div>
      </CardFooter>
    </Card>
  );
};

export default CardItem;
