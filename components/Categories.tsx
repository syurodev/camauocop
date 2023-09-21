"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

import { getTopProductType } from "@/actions/productType";

interface ICategories {
  className?: string;
}

type ProductType = {
  typeName: string;
  totalSold: number;
};

const Categories: React.FC<ICategories> = ({ className }) => {
  const [productTypes, setProductTypes] = React.useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    const serverAction = async () => {
      setIsLoading(true);
      const res: ProductType[] = await getTopProductType();
      setProductTypes(res);
      setIsLoading(false);
    };
    serverAction();
  }, []);
  return (
    <motion.section
      className={`glassmorphism w-full mt-5`}
      initial={{ y: 0, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      <ScrollArea className="h-fit w-full rounded-md">
        {isLoading ? (
          <>
            <Skeleton className="w-full h-[40px] rounded-lg" />
          </>
        ) : (
          <div className="flex justify-around">
            {/* TODO: MAP ITEM */}
            {productTypes.length > 0 &&
              productTypes.map((type) => (
                <Button key={type.typeName} variant={"ghost"}>
                  <Link
                    className="whitespace-nowrap"
                    href={`/products/${encodeURIComponent(type.typeName)}`}
                  >
                    {type.typeName}
                  </Link>
                </Button>
              ))}
          </div>
        )}
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </motion.section>
  );
};

export default Categories;
