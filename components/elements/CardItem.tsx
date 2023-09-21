"use client";

import * as React from "react";
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import { useRouter } from "next/navigation";

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
    // <Card
    //   shadow="sm"
    //   key={data._id}
    //   isPressable
    //   onPress={() => router.push(`/products/product/${data._id}`)}
    // >
    //   <CardBody className="overflow-visible p-0 flex items-center justify-center">
    //     <Image
    //       isZoomed
    //       shadow="sm"
    //       radius="lg"
    //       width={"auto"}
    //       height={256}
    //       alt={data.productName}
    //       className="max-w-lg max-h-[256px] h-auto w-auto object-cover aspect-[1/0.5]"
    //       src={data.productImages[0]}
    //     />
    //   </CardBody>

    //   <CardFooter className="text-small flex-col h-[84px] justify-between">
    //     <b className="line-clamp-2">{data.productName}</b>
    //     <p className="text-default-500">{formattedPriceWithUnit}</p>
    //   </CardFooter>
    // </Card>
    <Card
      shadow="sm"
      key={data._id}
      isPressable
      onPress={() => router.push(`/products/product/${data._id}`)}
    >
      <CardBody className="overflow-visible p-0">
        <Image
          shadow="sm"
          radius="lg"
          isZoomed
          width="100%"
          alt={data.productName}
          className="w-full object-cover h-[140px]"
          src={data.productImages[0]}
        />
      </CardBody>
      <CardFooter className="flex flex-col text-small justify-between">
        <b className="line-clamp-1">{data.productName}</b>
        <p className="text-default-500">{formattedPriceWithUnit}</p>
      </CardFooter>
    </Card>
  );
};

export default CardItem;
