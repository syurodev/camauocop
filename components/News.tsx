"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button, Card, CardBody, CardFooter, Skeleton } from "@nextui-org/react";
import { useRouter } from "next/navigation";

import CardItem from "./card/CardItem";
import { getProducts } from "@/actions/products";

type INews = {
  className?: string;
};

const News: React.FC<INews> = ({ className }) => {
  const router = useRouter()
  const [news, setNews] = useState<IProducts[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchApi = async () => {
      setIsLoading(true);
      const res: IProductsResponse = await getProducts();
      setNews(res?.products);
      setIsLoading(false);
    };
    fetchApi();
  }, []);

  return (
    <section className={`w-full ${className || ""} `}>
      <div
        className="flex flex-row items-center"
      >
        <motion.h3
          className="w-full text-left font-bold text-2xl"
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          SẢN PHẨM MỚI
        </motion.h3>

        <Button
          size="sm"
          variant="flat"
          className="border-none"
          onPress={() => router.push(`/products/news`)}
        >
          Xem thêm
        </Button>
      </div>

      <div className="mt-5 grid items-center sm:grid-cols-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 lg:gap-4 xl:gap-5">
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
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
          : news.length > 0 &&
          news.map((item) => {
            return <CardItem key={item?._id} data={item} />;
          })}
      </div>
    </section>
  );
};

export default News;
