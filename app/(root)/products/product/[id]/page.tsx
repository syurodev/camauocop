import React from "react";
import { getProductDetail } from "@/actions/products";
import { Metadata } from "next";
import Link from "next/link";
import { getServerSession } from "next-auth/next"

import ActionButtons from "./components/ActionButtons";
import RenderDescription from "./components/RenderDescription";
import Recommectdation from "./components/Recommectdation";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { Session } from "next-auth";
import ShopInfo from "./components/ShopInfo";
import Wrapper from "./components/Wrapper";
import TopSide from "./components/TopSide";

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
        className="flex flex-col lg:!flex-row gap-3 lg:!gap-10"
      >
        <Wrapper>
          <div
            className="flex flex-col gap-4 mt-2"
          >
            <TopSide productData={JSON.stringify(data)} />

            <div className="flex flex-col gap-5 md:!flex-row md:!justify-between">
              <div className="flex flex-col gap-5 md:!mr-5 w-full">
                <div className="lg:hidden">
                  <ShopInfo data={JSON.stringify(data)} />
                </div>

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
          </div>
        </Wrapper>

        <div className="hidden lg:!flex flex-col w-fit">
          <ActionButtons data={JSON.stringify(data)} />
        </div>

      </article>
    )
  );
};
export default ProductDetailPage;
