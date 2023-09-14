"use client";

import * as React from "react";
import { IProducts } from "@/lib/interface/interface";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import Link from "next/link";
import { motion } from "framer-motion";

import { AiOutlineShoppingCart, AiOutlineHeart } from "react-icons/ai";

interface CardItemProps {
  data: IProducts;
}

const CardItem: React.FC<CardItemProps> = ({ data }) => {
  let formattedPriceWithUnit = "";
  if (data.productPrice && !isNaN(data.productPrice)) {
    const formattedPrice = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(data.productPrice);

    formattedPriceWithUnit = `${formattedPrice}/Kg`;
  }

  return (
    <motion.div
      layout
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
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
              priority
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
                    className="rounded-full text-xl"
                    size={"icon"}
                    variant={"ghost"}
                  >
                    <AiOutlineHeart />
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
                    className="rounded-full text-xl"
                    size={"icon"}
                    variant={"ghost"}
                  >
                    <AiOutlineShoppingCart />
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
    </motion.div>
  );
};

export default CardItem;
