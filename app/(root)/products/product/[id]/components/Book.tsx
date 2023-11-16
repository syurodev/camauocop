"use client"
import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useAppSelector } from '@/redux/store'
import { IOrderZodSchema, OrderZodSchema } from '@/lib/zodSchema/order';

export default function Book() {

  const product: IProductDetail[] | null = useAppSelector(state => state.productsDetailReducer.value)
  const session = useAppSelector(state => state.sessionReducer.value)

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm<IOrderZodSchema>({
    resolver: zodResolver(OrderZodSchema),
    defaultValues: ({
      buyerId: session?.user._id,
      shopId: product![0]._id || "",
      type: "book"
    })
  });

  const onSubmit = async () => {

  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>

    </form>
  )
}
