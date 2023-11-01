import { Session, getServerSession } from 'next-auth';
import React from 'react'

import { getOrders } from '@/actions/order';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import Orders from '@/components/card/Orders';
import { redirect } from 'next/navigation';

type Props = {
  params: { id: string };
};

const MyOrderPage: React.FC<Props> = async ({ params }: Props) => {
  const session: Session | null = await getServerSession(authOptions)
  let data: IOrders[] | [] = []
  if (session) {
    const res = await getOrders({
      id: params.id,
      accessToken: session.user.accessToken,
      role: "individual",
      page: 1,
      perPage: 20
    })
    if (res.code === 200) {
      data = JSON.parse(res.data)
    }
  } else {
    redirect("/")
  }

  return (
    <>
      {
        session && data && data.length > 0 && (
          <Orders
            isLoading={false}
            orders={data}
            role={session?.user?.role}
          />
        )
      }
    </>
  )
}

export default MyOrderPage
