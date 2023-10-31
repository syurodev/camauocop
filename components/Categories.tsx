"use client";

import * as React from "react";
import { Card, Image, CardHeader, CardBody } from "@nextui-org/react";
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
    <div className="flex flex-col gap-3">
      <h3
        className="w-full text-left font-bold text-2xl"
      >
        OCOP
      </h3>

      <div
        // className="flex flex-row whitespace-nowrap gap-3 items-start justify-start"
        className="grid items-center sm:grid-cols-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4 xl:gap-5"
      >
        {
          categories.slice(0, 4).map(category => {
            return (
              <Card
                key={category.id}
                className="py-4 max-w-[258px]"
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
                    className="object-cover rounded-xl w-[270px] h-[200px]"
                    src={category.image}
                    width={270}
                    height={200}
                  />
                </CardBody>
              </Card>
            )
          })
        }

        <Card
          className="py-4 max-w-[258px] h-full"
          isPressable
          onPress={() => router.push(`/specialty`)}
        >
          <CardHeader>
            <p className="text-tiny uppercase font-bold text-primary">Xem tất cả</p>

          </CardHeader>
          <CardBody className="overflow-visible py-2 flex items-center justify-center h-full">
            <GrFormNextLink className="text-4xl" />
          </CardBody>
        </Card>
      </div>

    </div>
  );
};

export default Categories;
