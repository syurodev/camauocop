import React from 'react'
import { Session } from 'next-auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { getCartItems } from '@/actions/cart';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { getProductDetail } from '@/actions/products';
import { ICart } from '@/lib/models/carts';
import CartView from './components/CartView';

type IProps = {
  params: { id: string };
}

const CartPage: React.FC<IProps> = async ({ params }) => {
  const session: Session | null = await getServerSession(authOptions)

  let productsData: IProductDetail | IProductDetail[] | null = null

  if (session) {
    const res = await getCartItems(params.id, session?.user.accessToken)

    if (res.code === 200 && res.data) {
      const data: ICart = JSON.parse(res.data)
      if (data.products && data.products.length > 0) {
        const productsId = data.products.map(item => item.productId);
        productsData = await getProductDetail(productsId)
      }
    }

  } else {
    redirect("/login")
  }

  return (
    <article>
      {
        productsData ? (
          <CartView data={JSON.stringify(productsData)} />
        ) : (
          <span>Không có sản phẩm trong giỏ hàng</span>
        )
      }

    </article>
  )
}

export default CartPage