import React from 'react'
import AdminContent from './components/Content'
import { Session, getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { redirect } from 'next/navigation'

const AdminPage: React.FC = async () => {

  const session: Session | null = await getServerSession(authOptions)
  if (session) {
    if (session.user.role !== "admin") {
      redirect("/")
    }
  } else {
    redirect("/login")
  }

  return (
    <>
      {
        session && <AdminContent />
      }
    </>
  )
}

export default AdminPage