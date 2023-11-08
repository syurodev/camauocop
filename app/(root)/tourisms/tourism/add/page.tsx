import React from 'react'
import { redirect } from 'next/navigation'

import AddTourismsForm from '@/components/form/AddTourismsForm'
import { Session, getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'

const AddTourismsPage: React.FC = async () => {
  const session: Session | null = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }
  return (
    <>
      <AddTourismsForm />
    </>
  )
}

export default AddTourismsPage