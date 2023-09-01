'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Input } from '@/components/ui/input';
import { Textarea } from "@/components/ui/textarea"
import { Button } from '@/components/ui/button';
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

import { AddProductZodSchema, type IAddProductZodSchema } from '@/lib/zodSchema/products';
import { useSession } from 'next-auth/react';
import FileUpload from '@/components/elements/FileUpload';
import { addProduct, getProductTypes } from '@/actions/products';
import { type IAddProductTypes } from "@/lib/interface/interface";

const fakeData = [
  {
    _id: 1,
    name: "Cá"
  },
  {
    _id: 2,
    name: "Cua"
  },
  {
    _id: 3,
    name: "Tôm"
  },
  {
    _id: 4,
    name: "Mực"
  }
]

const AddProduct: React.FC = () => {
  const router = useRouter()
  const [productTypes, setProductTypes] = useState<IAddProductTypes[]>([])
  const { data: session, status } = useSession();
  const { toast } = useToast()

  if (status === "unauthenticated") {
    router.push("/")
  }

  if (session?.user.role === "individual") {
    router.push("/")
  }

  useEffect(() => {
    const fetchApi = async () => {
      const res = await getProductTypes()
      setProductTypes(res)
    }
    fetchApi()
  }, [])


  const form = useForm<IAddProductZodSchema>({
    resolver: zodResolver(AddProductZodSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      productType: "",
      quantity: 0,
      sellerId: "",
      images: [],
      auction: false
    },
  })

  const onSubmit = async (data: IAddProductZodSchema) => {
    data = { ...data, sellerId: session?.user._id || "" }
    const res = await addProduct(data)
    if (res) {
      // TODO: dẫn về trang sản phẩm cá nhân
      router.push("/")
    } else {
      toast({
        title: "Có lỗi trong quá trình thêm sản phẩm",
        description: "Hãy kiểm tra bạn đã nhập đầy đủ các trường chưa và thử lại",
      })
    }
    console.log(res)
  }

  return (
    <section>
      <motion.h1
        className='my-3 text-3xl font-bold'
        initial={{ y: 0, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        THÊM SẢN PHẨM
      </motion.h1>
      <Form {...form}>
        <form
          className='mt-7 px-2'
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className='flex flex-col sm:!flex-row sm:gap-5'>
            <div className='w-full'>
              <motion.div
                className="mt-4"
                initial={{ y: 0, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên sản phẩm: </FormLabel>
                      <FormControl>
                        <Input placeholder='Tên sản phẩm' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div
                className="mt-4"
                initial={{ y: 0, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <FormField
                  control={form.control}
                  name="productType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loại sản phẩm:</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn loại sản phẩm" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {
                            productTypes.map((item, index) => {
                              return (
                                <motion.div
                                  key={item._id}
                                  initial={{ y: 0, opacity: 0 }}
                                  animate={{ y: 0, opacity: 1 }}
                                  transition={{ delay: index / 10 }}
                                >
                                  <SelectItem value={item._id}>{item.name}</SelectItem>
                                </motion.div>
                              )
                            })
                          }
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div
                className="mt-4"
                initial={{ y: 0, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <FormField
                  control={form.control}
                  name='quantity'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số lượng sản phẩm (Kg): </FormLabel>
                      <FormControl>
                        <Input type='number' placeholder='Số lượng sản phẩm' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div
                className="mt-4"
                initial={{ y: 0, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <FormField
                  control={form.control}
                  name='price'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giá sản phẩm: </FormLabel>
                      <FormControl>
                        <Input placeholder='Giá sản phẩm' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
            </div>

            <div className='w-full'>
              <motion.div
                className="mt-4"
                initial={{ y: 0, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mô tả sản phẩm: </FormLabel>
                      <FormControl>
                        <Textarea placeholder="Nhập mô tả sản phẩm" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div
                className="mt-4"
                initial={{ y: 0, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <FormField
                  control={form.control}
                  name='auction'
                  render={({ field }) => (
                    <FormItem
                      className='flex items-center justify-between'
                    >
                      <FormLabel htmlFor='auction'>Sản phẩm đấu giá: </FormLabel>
                      <FormControl>
                        <Switch
                          className='!mt-0'
                          id="auction"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
            </div>
          </div>

          <motion.div
            className="mt-4"
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <FormField
              control={form.control}
              name='images'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hình ảnh: </FormLabel>
                  <FormControl>
                    <FileUpload
                      enpoint="productImages"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div
            className='flex items-center justify-end mt-4'
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Button type='submit'>Thêm sản phẩm</Button>
          </motion.div>
        </form>
      </Form>
    </section>
  )
}

export default AddProduct