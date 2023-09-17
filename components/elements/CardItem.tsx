"use client";

import * as React from "react";

import { Button } from "@nextui-org/react";
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
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
      <Card
        shadow="sm"
        key={data._id}
        isPressable
        fullWidth={false}
        className="w-[100%]"
      >
        <CardBody className="overflow-visible p-0 flex items-center justify-center">
          <Image
            isZoomed
            shadow="sm"
            radius="lg"
            alt={data.productName}
            className="max-w-lg max-h-lg h-auto w-auto object-cover aspect-[1/0.5]"
            src={data.productImages[0]}
          />
        </CardBody>

        <CardFooter className="text-small flex-col h-[84px] justify-between">
          <b className="line-clamp-2">{data.productName}</b>
          <p className="text-default-500">{formattedPriceWithUnit}</p>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default CardItem;
