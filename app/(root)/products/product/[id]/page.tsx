import React from "react";
import { getProductDetail } from "@/actions/products";
import { IProductDetail } from "@/lib/interface/interface";
import { Metadata } from "next";

import SlideShow from "@/components/elements/SlideShow";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data: IProductDetail | null = await getProductDetail(params.id);

  return {
    title: data?.productName || "404",
    description: `Chi tiết sản phẩm ${data?.productName || ""}`,
  };
}

const ProductDetailPage: React.FC<Props> = async ({ params }) => {
  const data: IProductDetail | null = await getProductDetail(params.id);
  return (
    <article>
      <h1>{data?.productName}</h1>
      <h3>{data?.productTypeName}</h3>
      <SlideShow images={data?.productImages} />
    </article>
  );
};
export default ProductDetailPage;
