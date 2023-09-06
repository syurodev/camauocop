"use client";
import React, { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IAddProductTypes } from "@/lib/interface/interface";
import { addProductType, getProductTypes } from "@/actions/products";
import { IAddProductTypeZodSchema } from "@/lib/zodSchema/products";
import { Label } from "../ui/label";
import { FormControl, FormLabel } from "../ui/form";

type ProductTypesProps = {
  sessionId: string | undefined;
  onChange: (item?: string | string[]) => void;
  value: string | undefined;
};

const ProductTypes: React.FC<ProductTypesProps> = ({
  sessionId,
  value,
  onChange,
}) => {
  const { toast } = useToast();

  const [productTypes, setProductTypes] = useState<IAddProductTypes[]>([]);
  const [newProductTypes, setNewProductTypes] = useState<string>("");

  useEffect(() => {
    const fetchApi = async () => {
      const res = await getProductTypes();
      setProductTypes(res);
    };
    fetchApi();
  }, []);

  const onSubmit = async () => {
    if (newProductTypes.trim() === "") {
      toast({
        title: "Lỗi!!!",
        description: "Vui lòng nhập tên loại hàng hoá",
      });
      return;
    }
    const res = await addProductType({
      name: newProductTypes,
      userId: sessionId,
    });

    if (res.satus && res.newProductType) {
      toast({
        title: "Thêm loại sản phẩm thành công",
        description: res.message,
      });
      setNewProductTypes("");
      setProductTypes([...productTypes, res.newProductType]);
    } else {
      toast({
        title: "Có lỗi!!!",
        description: res.message,
      });
    }
  };

  return (
    <>
      <div className="flex justify-between w-full items-center">
        <FormLabel>Loại sản phẩm:</FormLabel>
        <Dialog>
          <DialogTrigger asChild className="cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v12m6-6H6"
              />
            </svg>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Thêm loại hàng hoá</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col items-start">
                <Label htmlFor="productType">Tên loại hàng hoá: </Label>
                <Input
                  id="productType"
                  value={newProductTypes}
                  onChange={(e) => setNewProductTypes(e.target.value)}
                  className="mt-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={onSubmit}>
                Thêm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Select onValueChange={onChange} defaultValue={value}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Chọn loại sản phẩm" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {productTypes.map((item, index) => {
            return (
              <motion.div
                key={item._id}
                initial={{ y: 0, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index / 10 }}
              >
                <SelectItem key={item._id} value={item._id}>
                  {item.name}
                </SelectItem>
              </motion.div>
            );
          })}
        </SelectContent>
      </Select>
    </>
  );
};

export default ProductTypes;
