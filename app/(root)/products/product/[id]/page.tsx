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
import ShopInfo from "./components/ShopInfo";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data: IProductDetail | IProductDetail[] | null = await getProductDetail(params.id);

  if (Array.isArray(data)) {
    return {
      title: data[0]?.productName || "404",
      description: `Chi tiết sản phẩm ${data[0]?.productName || ""}`,
    };
  } else {
    return {
      title: data?.productName || "404",
      description: `Chi tiết sản phẩm ${data?.productName || ""}`,
    };
  }
}

const ProductDetailPage: React.FC<Props> = async ({ params }) => {
  const session: Session | null = await getServerSession(authOptions)

  const data: IProductDetail | IProductDetail[] | null = await getProductDetail(params.id, session?.user._id);

  return (
    Array.isArray(data) ? (
      <></>
    ) : (
      <article
        className="flex flex-col gap-4 mt-2"
      >
        <div className="flex flex-col lg:!flex-row gap-5">
          <SlideShow images={data?.productImages || []} />

          <div className="lg:w-1/2">
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
              <p>{`${data?.productSold}kg đã bán`}</p>
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

        <div className="flex flex-col gap-5 md:!flex-row md:!justify-between">
          <div className="flex flex-col gap-5 md:!mr-5 w-full">
            <ShopInfo data={JSON.stringify(data)} />

            <div className="w-full">
              <h2>Mô tả sản phẩm</h2>
              <RenderDescription description={data?.productDescription} />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h2>Gợi ý</h2>
            <Recommectdation id={params.id} />
          </div>
        </div>
      </article>
    )
  );
};
export default ProductDetailPage;
