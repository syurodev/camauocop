import React from 'react'
import { Session, getServerSession } from 'next-auth';

import { getShopInfo } from '@/actions/shop';
import TopSide from '@/components/card/TopSide';
import Content from './components/Content';
// import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import Wrapper from './components/Wrapper';

type Props = {
  params: { id: string };
};

const ShopPage: React.FC<Props> = async ({ params }) => {
  let info = ""

  const data: ShopInfoResponse = await getShopInfo(params.id)
  if (data.data) {
    info = JSON.stringify(data.data)
  }
  return (
    data.data ? (
      <article>
        <Wrapper info={info}>
          <TopSide />
          <Content
            shopId={params.id}
          />
        </Wrapper>
      </article>
    ) : (
      <>
        Không có thông tin shop
      </>
    )
  )
}
export default ShopPage