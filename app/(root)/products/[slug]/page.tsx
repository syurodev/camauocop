"use client";
import { getProducts, searchProducts } from "@/actions/products";
import { FC, useEffect, useState } from "react";

import CardItem from "@/components/card/CardItem";
import { Pagination } from "@nextui-org/react";

type IProps = {
  params: {
    slug: string;
  };
};

const ProductsPage: FC<IProps> = ({ params }) => {
  const [data, setData] = useState<IProductsResponse>();
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      if (params.slug === "news") {
        const res: IProductsResponse = await getProducts(page, 24);
        setData(res)
      } else {
        const slug = decodeURIComponent(params.slug);
        const response = await searchProducts(slug, page);
        setData(response);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.slug]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="mt-5 grid items-center sm:grid-cols-2 grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3 lg:gap-4 xl:gap-5">
        {data &&
          data.products.map((product) => (
            <CardItem key={product?._id} data={product} />
          ))}
      </div>

      <Pagination showControls total={data?.totalPages || 1} initialPage={page} />
    </div>
  );
};

export default ProductsPage;
