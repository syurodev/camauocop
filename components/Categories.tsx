"use client";

import * as React from "react";
import { Card, Image, CardHeader, CardBody, Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { GrFormNextLink } from "react-icons/gr"

import { categories } from "@/lib/constant/CategoriesDefault"

type ProductType = {
  typeName: string;
  totalSold: number;
};

const Categories: React.FC = () => {
  const router = useRouter();

  return (
    <div className="flex w-full flex-col gap-3">
      <div
        className="flex flex-row items-center"
      >
        <h3
          className="w-full text-left font-bold text-2xl"
        >
          OCOP
        </h3>

        <Button
          size="sm"
          variant="flat"
          className="border-none"
          onPress={() => router.push(`/specialty`)}
        >
          Xem tất cả
        </Button>
      </div>

      <div
        // className="flex flex-row whitespace-nowrap gap-3 items-start justify-start"
        className="w-full grid items-center sm:grid-cols-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-3 lg:gap-4 xl:gap-5"
      >
        {
          categories.slice(0, 6).map(category => {
            return (
              <Card
                key={category.id}
                className="py-4 max-w-[258px] m-auto"
                isPressable
                onPress={() => router.push(`/products/ocop/${encodeURIComponent(category.lable)}`)}
              >
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                  <p className="text-tiny uppercase font-bold text-primary">Đặc sản</p>
                  <small className="text-default-500 line-clamp-3">{category.description || ""}</small>
                  <h4 className="font-bold text-large line-clamp-1">{category.lable}</h4>
                </CardHeader>
                <CardBody className="overflow-visible py-2">
                  <Image
                    alt="Card background"
                    src={category.image}
                    width={"100%"}
                    className="object-cover rounded-xl w-[270px] h-[180px]"
                  />
                </CardBody>
              </Card>
            )
          })
        }
      </div>

    </div>
  );
};

export default Categories;
