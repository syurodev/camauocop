import React from 'react'
import { Session, getServerSession } from 'next-auth';

import { getShopInfo } from '@/actions/shop';
import TopSide from '@/components/card/TopSide';
import Content from './components/Content';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

type Props = {
  params: { id: string };
};

const ShopPage: React.FC<Props> = async ({ params }) => {
  let info = ""

  const session: Session | null = await getServerSession(authOptions)

  const data: ShopInfoResponse = await getShopInfo(params.id)
  if (data.data) {
    info = JSON.stringify(data.data)
  }
  return (
    data.data ? (
      <article className='flex flex-col gap-3'>
        <TopSide info={info} />
        <Content
          id={session?.user._id.toString() || ""}
          info={info}
          role={session?.user.role || ""}
          accessToken={session?.user.accessToken || ""}
          shopId={params.id}
        />
      </article>
    ) : (
      <>
        Không có thông tin shop
      </>
    )
  )
}
export default ShopPage