import React from "react";

import { Form, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  AddProductTypeZodSchema,
  IAddProductTypeZodSchema,
} from "@/lib/zodSchema/products";
import { Input } from "@/components/ui/input";

import { addProductType } from "@/actions/products";
import { useToast } from "../ui/use-toast";
import { IAddProductTypes } from "@/lib/interface/interface";
import { Button } from "../ui/button";

type Props = {
  sessionId: string | undefined;
  setProductTypes: React.Dispatch<React.SetStateAction<IAddProductTypes[]>>;
  productTypes: IAddProductTypes[];
};

const AddProductTypeForm: React.FC<Props> = ({
  sessionId,
  setProductTypes,
  productTypes,
}) => {
  const { toast } = useToast();

  const formAddProductType = useForm<IAddProductTypeZodSchema>({
    resolver: zodResolver(AddProductTypeZodSchema),
    defaultValues: {
      userId: "",
      name: "",
    },
  });

  const onSubmit = async (data: IAddProductTypeZodSchema) => {
    data = { ...data, userId: sessionId };
    console.log(data);
    const res = await addProductType(data);

    if (res.satus && res.newProductType) {
      toast({
        title: "Thêm loại sản phẩm thành công",
        description: res.message,
      });
      setProductTypes([...productTypes, res.newProductType]);
    } else {
      toast({
        title: "Có lỗi!!!",
        description: res.message,
      });
    }
  };

  return (
    <Form {...formAddProductType}>
      <form
        onSubmit={formAddProductType.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <FormField
          control={formAddProductType.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default AddProductTypeForm;
