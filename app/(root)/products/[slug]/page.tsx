"use client";
import { searchProducts } from "@/actions/products";
import { FC, useEffect, useState } from "react";

import CardItem from "@/components/elements/CardItem";

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
    <div className="mt-5 grid items-center sm:grid-cols-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
      {data &&
        data.products.map((product) => (
          <CardItem key={product?._id} data={product} />
        ))}
    </div>
  );
};

export default ProductsPage;
