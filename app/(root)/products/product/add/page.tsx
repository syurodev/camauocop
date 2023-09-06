'use client'

import React from 'react'
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import AddProductForm from '@/components/form/AddProductForm';

const AddProduct: React.FC = () => {
  const router = useRouter()
  const { data: session, status } = useSession();

  if (status === "unauthenticated") {
    router.push("/")
  }

  if (session?.user.role === "individual") {
    router.push("/")
  }

  return (
    <>
      <motion.h1
        className='my-3 text-3xl font-bold'
        initial={{ y: 0, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        THÊM SẢN PHẨM
      </motion.h1>

      <AddProductForm session={session} />
    </>
  )
}

export default AddProduct