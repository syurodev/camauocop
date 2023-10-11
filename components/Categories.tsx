"use client";

import * as React from "react";
import { Button, Skeleton, Card } from "@nextui-org/react";
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
    <Card
      shadow="sm"
      className={`w-[100%] overflow-scroll flex justify-start md:justify-around flex-row ${className || ""
        }`}
    >
      {isLoading ? (
        <>
          <Skeleton className="w-full h-[40px] rounded-lg" />
        </>
      ) : (
        <>
          {/* TODO: MAP ITEM */}
          {productTypes && productTypes.length > 0 &&
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
        </>
      )}
    </Card>
  );
};

export default Categories;
