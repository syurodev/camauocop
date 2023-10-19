"use client";

import * as React from "react";
import { Button, Skeleton, Card, ScrollShadow } from "@nextui-org/react";
import { useRouter } from "next/navigation";

import { getTopProductType } from "@/actions/productType";

type ProductType = {
  typeName: string;
  totalSold: number;
};

const Categories: React.FC = () => {
  const [productTypes, setProductTypes] = React.useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
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
    // <Card
    //   shadow="sm"
    //   className={`w-[100%] h-[40px] overflow-scroll flex justify-start md:justify-around flex-row ${className || ""
    //     }`}
    // >
    //   {isLoading ? (
    //     <>
    //       <Skeleton className="w-full h-[40px] rounded-lg" />
    //     </>
    //   ) : (
    //     <>
    //       {/* TODO: MAP ITEM */}
    //       {productTypes && productTypes.length > 0 ?
    //         productTypes.map((type) => (
    //           <Button
    //             key={type.typeName}
    //             variant={"ghost"}
    //             className="border-none whitespace-nowrap"
    //             onPress={() =>
    //               router.push(`/products/${encodeURIComponent(type.typeName)}`)
    //             }
    //           >
    //             {type.typeName}
    //           </Button>
    //         )) :
    //         <div className="flex justify-center items-center w-full h-full">
    //           <span className="opacity-70 font-semibold">Chưa có loại sản phẩm</span>
    //         </div>
    //       }
    //     </>
    //   )}
    // </Card>
    <ScrollShadow hideScrollBar className="w-full h-[42px] shadow-lg flex justify-start md:justify-around flex-row bg-white dark:!bg-[#18181b]">
      <>
        {isLoading ? (
          <>
            <Skeleton className="w-full h-[40px] rounded-lg" />
          </>
        ) : (
          <>
            {/* TODO: MAP ITEM */}
            {productTypes && productTypes.length > 0 ?
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
              )) :
              <div className="flex justify-center items-center w-full h-full">
                <span className="opacity-70 font-semibold">Chưa có loại sản phẩm</span>
              </div>
            }
          </>
        )}
      </>
    </ScrollShadow>
  );
};

export default Categories;
