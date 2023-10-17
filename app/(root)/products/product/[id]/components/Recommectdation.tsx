"use client";
import React from "react";
import { Card, CardBody, CardFooter, Image, Skeleton } from "@nextui-org/react";
import { useRouter } from "next/navigation";

import { getRecommentdation } from "@/actions/recommendation";
import { formattedPriceWithUnit } from "@/lib/formattedPriceWithUnit";
import CardItem from "@/components/card/CardItem";

type Props = {
  id: string;
};

const Recommectdation: React.FC<Props> = ({ id }) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [recommendation, setRecommendation] =
    React.useState<IProductsResponse>();

  React.useEffect(() => {
    const fetchApi = async () => {
      setIsLoading(true);
      const data: IProductsResponse = await getRecommentdation(id);
      setRecommendation(data);
      setIsLoading(false);
    };
    fetchApi();
  }, [id]);

  return (
    <div className="mt-5 grid items-center sm:grid-cols-2 grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3 lg:gap-4 xl:gap-5">
      {isLoading ? (
        Array.from({ length: 6 }).map((_, index) => (
          <Card shadow="sm" key={index}>
            <Skeleton isLoaded={!isLoading} className="rounded-lg">
              <CardBody className="overflow-visible p-0">
                <div className="w-full h-[140px]"></div>
              </CardBody>
            </Skeleton>

            <CardFooter className="flex flex-col text-small justify-between">
              <Skeleton isLoaded={!isLoading} className="rounded-lg">
                <b className="line-clamp-2">productname</b>
              </Skeleton>
              <Skeleton isLoaded={!isLoading} className="rounded-lg mt-2">
                <p className="text-default-500">productprice</p>
              </Skeleton>
            </CardFooter>
          </Card>
        ))
      ) : recommendation && recommendation?.products.length > 0 ? (
        recommendation.products.map((product) => {
          return (
            <CardItem key={product._id} data={product} />
          );
        })
      ) : (
        <p>Không có sản phẩm gợi ý</p>
      )}
    </div>
  );
};
export default React.memo(Recommectdation);
