import React from "react";
import { getProductDetail } from "@/actions/products";
import { Metadata } from "next";
import Link from "next/link";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";

import SlideShow from "@/components/elements/SlideShow";
import ActionButtons from "./components/ActionButtons";
import RenderDescription from "./components/RenderDescription";
import Recommectdation from "./components/Recommectdation";

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

  let formattedPriceWithUnit = "";
  if (data && data.productPrice && !isNaN(data.productPrice)) {
    const formattedPrice = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(data.productPrice);

    formattedPriceWithUnit = `${formattedPrice}/Kg`;
  }
  return (
    <article className="mt-2">
      <div className="flex flex-col lg:flex-row">
        <SlideShow images={data?.productImages || []} />
        <div className="ml-3">
          <h1 className="font-bold text-4xl uppercase">{data?.productName}</h1>
          <Link href={`/products/${data?.productTypeName}`}>
            {data?.productTypeName}
          </Link>

          <div className="flex items-center justify-between">
            <div className="flex text-primary">
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiOutlineStar />
              <AiOutlineStar />
            </div>
            <p>1000 đánh giá</p>
            <p>{`${data?.productSold}Kg đã bán`}</p>
          </div>

          <h2 className="text-center my-2 font-bold">
            {formattedPriceWithUnit}
          </h2>

          <p className="text-center">
            Số lượng còn lại: {data?.productQuantity}Kg
          </p>
          <ActionButtons />
        </div>
      </div>

      <div className="flex flex-col">
        <div className="mt-5">
          <h2>Mô tả sản phẩm</h2>
          <RenderDescription description={data?.productDescription} />
        </div>
        <div className="mt-5">
          <h2>Gợi ý</h2>
          <Recommectdation id={params.id} />
        </div>
      </div>
    </article>
  );
};
export default ProductDetailPage;
