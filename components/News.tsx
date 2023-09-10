"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CardItem from "./elements/CardItem";
import { IProducts } from "@/lib/interface/interface";
import { getProducts } from "@/actions/products";

interface INews {
  className?: string;
}

const News: React.FC<INews> = ({ className }) => {
  const [news, setNews] = useState<IProducts[]>([]);

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
      const res = await getProducts();
      setNews(res.products);
    };
    fetchApi();
  });

  return (
    <motion.section
      className={`p-5 w-full ${className || ""} `}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6 }}
    >
      <h3 className="w-full text-left font-bold text-2xl">SẢN PHẨM MỚI</h3>

      <div className="mt-5 grid items-center sm:grid-cols-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {/* TODO:Carditem */}
        {news.length > 0 &&
          news.map((item) => {
            return <CardItem key={item?._id} data={item} />;
          })}
      </div>
    </motion.section>
  );
};

export default News;
