"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button, Skeleton } from "@nextui-org/react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

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
      {isLoading ? (
        <>
          <Skeleton className="w-full h-[40px] rounded-lg" />
        </>
      ) : (
        <div className="flex justify-around">
          {/* TODO: MAP ITEM */}
          {productTypes.length > 0 &&
            productTypes.map((type) => (
              <Button
                key={type.typeName}
                variant={"ghost"}
                className="border-none whitespace-nowrap"
                onPress={() =>
                  router.push(`/products/${encodeURIComponent(type.typeName)}`)
                }
              >
                {type.typeName}
              </Button>
            ))}
        </div>
      )}
    </motion.section>
  );
};

export default Categories;
