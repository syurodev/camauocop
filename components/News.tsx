"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CardItem from "./elements/CardItem";
import { IProducts } from "@/lib/interface/interface";
import { getProducts } from "@/actions/products";

// import { Skeleton } from "@nextui-org/skeleton";
import { Skeleton } from "@/components/ui/skeleton";

type INews = {
  className?: string;
};

type Response = {
  products: {
    _id: string;
    productName: string;
    productTypeName: string;
    sellerName: string;
    sellerAvatar: string;
    productImages: string[];
    productPrice: number;
  }[];
  totalPages: number;
};

const News: React.FC<INews> = ({ className }) => {
  const [news, setNews] = useState<IProducts[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // useEffect(() => {
  //   const fetchApi = async () => {
  //     const res = await fetch(
  //       `/api/products/recommendation/64fd798338b9356ce033171a`,
  //       {
  //         method: "GET",
  //         headers: {
  //           "content-type": "application/json",
  //         },
  //       }
  //     );
  //     const data = await res.json();
  //     setRecommendation(data);
  //   };
  //   fetchApi();
  // }, []);

  useEffect(() => {
    const fetchApi = async () => {
      setIsLoading(true);
      const res: Response = await getProducts();
      setNews(res?.products);
      setIsLoading(false);
    };
    fetchApi();
  }, []);

  return (
    <section className={`p-5 w-full ${className || ""} `}>
      <motion.h3
        className="w-full text-left font-bold text-2xl"
        initial={{ y: 0, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        SẢN PHẨM MỚI
      </motion.h3>

      <div className="mt-5 grid items-center sm:grid-cols-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {isLoading ? (
          <>
            <Skeleton className="w-full min-w-[300px] max-w-[400px] h-[150px] rounded-lg" />
            <Skeleton className="w-full min-w-[300px] max-w-[400px] h-[150px] rounded-lg hidden sm:block" />
            <Skeleton className="w-full min-w-[300px] max-w-[400px] h-[150px] rounded-lg lg:block hidden" />
            <Skeleton className="w-full min-w-[300px] max-w-[400px] h-[150px] rounded-lg xl:block hidden" />
            <Skeleton className="w-full min-w-[300px] max-w-[400px] h-[150px] rounded-lg" />
            <Skeleton className="w-full min-w-[300px] max-w-[400px] h-[150px] rounded-lg hidden sm:block" />
            <Skeleton className="w-full min-w-[300px] max-w-[400px] h-[150px] rounded-lg lg:block hidden" />
            <Skeleton className="w-full min-w-[300px] max-w-[400px] h-[150px] rounded-lg xl:block hidden" />
            <Skeleton className="w-full min-w-[300px] max-w-[400px] h-[150px] rounded-lg" />
            <Skeleton className="w-full min-w-[300px] max-w-[400px] h-[150px] rounded-lg hidden sm:block" />
            <Skeleton className="w-full min-w-[300px] max-w-[400px] h-[150px] rounded-lg lg:block hidden" />
            <Skeleton className="w-full min-w-[300px] max-w-[400px] h-[150px] rounded-lg xl:block hidden" />
          </>
        ) : (
          news.length > 0 &&
          news.map((item) => {
            return <CardItem key={item?._id} data={item} />;
          })
        )}
      </div>
    </section>
  );
};

export default News;
