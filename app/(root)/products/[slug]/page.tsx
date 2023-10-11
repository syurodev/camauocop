"use client";
import { searchProducts } from "@/actions/products";
import { FC, useEffect, useState } from "react";

import CardItem from "@/components/card/CardItem";

type IProps = {
  params: {
    slug: string;
  };
};

const ProductsPage: FC<IProps> = ({ params }) => {
  const [data, setData] = useState<IProductsResponse>();

  useEffect(() => {
    const fetchData = async () => {
      const slug = decodeURIComponent(params.slug);
      const response = await searchProducts(slug, 1);
      setData(response);
    };

    fetchData();
  }, [params.slug]);

  return (
    <div className="mt-5 grid items-center sm:grid-cols-2 grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3 lg:gap-4 xl:gap-5">
      {data &&
        data.products.map((product) => (
          <CardItem key={product?._id} data={product} />
        ))}
    </div>
  );
};

export default ProductsPage;
