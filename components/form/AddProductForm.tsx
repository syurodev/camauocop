"use client";

import React, {
  useState,
  experimental_useOptimistic as useOptimistic,
} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { OutputData } from "@editorjs/editorjs";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

import FileUpload from "@/components/elements/FileUpload";
import { addProduct } from "@/actions/products";
import {
  AddProductZodSchema,
  type IAddProductZodSchema,
} from "@/lib/zodSchema/products";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import ProductTypes from "../elements/ProductTypes";
import Editor from "../elements/editor/EditorJS";
import CustomInput from "../elements/CustomInput";

type AddProductFormProps = {
  session: Session | null;
};

const AddProductForm: React.FC<AddProductFormProps> = ({ session }) => {
  const router = useRouter();
  const { toast } = useToast();

  //const [description, setDescription] = useState<OutputData | null>(null);
  const [productAuction, setProductAuction] = useState<boolean>(false);

  const form = useForm<IAddProductZodSchema>({
    resolver: zodResolver(AddProductZodSchema),
    defaultValues: {
      name: "",
      description: {
        time: 1693924805318,
        blocks: [],
        version: "2.28.0",
      },
      price: 0,
      productType: "",
      quantity: 0,
      sellerId: "",
      images: [],
      auction: false,
    },
  });

  const onSubmit = async (data: IAddProductZodSchema) => {
    data = {
      ...data,
      sellerId: session?.user._id || "",
    };
    const res = await addProduct(data);
    if (res) {
      // TODO: dẫn về trang sản phẩm cá nhân
      router.push("/");
    } else {
      toast({
        title: "Có lỗi trong quá trình thêm sản phẩm",
        description:
          "Hãy kiểm tra bạn đã nhập đầy đủ các trường chưa và thử lại",
      });
    }
    console.log(res);
  };

  return (
    <Form {...form}>
      <form className="mt-7 px-2" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col sm:!flex-row sm:gap-5">
          <div className="w-full">
            <motion.div
              className="mt-4"
              initial={{ y: 0, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên sản phẩm: </FormLabel>
                    <FormControl>
                      <Input placeholder="Tên sản phẩm" {...field} />
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
                    <ProductTypes
                      sessionId={session?.user._id}
                      value={field.value}
                      onChange={field.onChange}
                    />
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
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số lượng sản phẩm (Kg): </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Số lượng sản phẩm"
                        {...field}
                      />
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
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá sản phẩm: </FormLabel>
                    <FormControl>
                      <CustomInput
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
          </div>

          <div className="w-full sm:max-w-[50%]">
            <motion.div
              className="mt-4"
              initial={{ y: 0, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả sản phẩm: </FormLabel>
                    <FormControl>
                      {/* <Textarea placeholder="Nhập mô tả sản phẩm" {...field} /> */}
                      <Editor
                        value={field.value as OutputData}
                        onChange={field.onChange}
                      />
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
                name="auction"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <FormLabel htmlFor="auction">Sản phẩm đấu giá: </FormLabel>
                    <FormControl>
                      <Switch
                        className="!mt-0"
                        id="auction"
                        checked={field.value}
                        onCheckedChange={(newValue) => {
                          field.onChange(newValue);
                          setProductAuction(newValue);
                        }}
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
            name="images"
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
          className="flex items-center justify-end mt-4"
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Button type="submit">Thêm sản phẩm</Button>
        </motion.div>
      </form>
    </Form>
  );
};

export default AddProductForm;
