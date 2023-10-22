import React from 'react'
import AddProductWrapper from './components/Wrapper'
import { Session, getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { redirect } from 'next/navigation'

const AddProductPage: React.FC = async () => {
  const session: Session | null = await getServerSession(authOptions)
  let sessionData

  if (!session) {
    redirect("/login")
  }

  return (
    <div>
      <AddProductWrapper />
    </div>
  )
}

export default AddProductPage