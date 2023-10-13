import React from 'react'

import ShopRegister from './components/ShopRegister';
import { Session, getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { redirect } from 'next/navigation';


const ShopRegisterPage: React.FC = async () => {
  const session: Session | null = await getServerSession(authOptions)
  if (session) {
    if (session.user.role !== "individual") {
      redirect("/")
    }
  } else {
    redirect("/login")
  }

  return (
    <>
      {
        session && <ShopRegister
          id={session.user._id.toString()}
          userPhone={session.user.phone}
        />
      }
    </>
  )
}

export default ShopRegisterPage