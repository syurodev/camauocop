import React from "react";
import { getProductDetail } from "@/actions/products";
import { Metadata } from "next";
import Link from "next/link";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";
import { getServerSession } from "next-auth/next"

import SlideShow from "@/components/elements/SlideShow";
import ActionButtons from "./components/ActionButtons";
import RenderDescription from "./components/RenderDescription";
import Recommectdation from "./components/Recommectdation";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { Session } from "next-auth";
import { formattedPriceWithUnit } from "@/lib/formattedPriceWithUnit";

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
  const session: Session | null = await getServerSession(authOptions)

  const data: IProductDetail | null = await getProductDetail(params.id, session?.user._id);

  return (
    <article className="mt-2">
      <div className="flex flex-col lg:flex-row gap-5">
        <SlideShow images={data?.productImages || []} />

        <div className="lg:flex-1">
          <h1 className="font-bold text-4xl uppercase">{data?.productName}</h1>
          <Link href={`/products/${data?.productTypeName}`} className="text-lg uppercase font-semibold opacity-70">
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
            {data?.productPrice ?
              `Giá bán lẻ: ${formattedPriceWithUnit(data?.productPrice)}`
              : "Không có giá bán lẻ"}
          </h2>

          <p className="text-center">
            Số lượng còn lại: {data?.productQuantity}Kg
          </p>
          <ActionButtons user={JSON.stringify(session)} data={JSON.stringify(data)} />
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
