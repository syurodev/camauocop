"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import toast from "react-hot-toast";

import FileUpload from "@/components/elements/FileUpload";
import { addProduct, getProductTypes } from "@/actions/products";
import {
  AddProductZodSchema,
  type IAddProductZodSchema,
} from "@/lib/zodSchema/products";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import ProductTypes from "../modal/ProductTypes";
import Editor from "../elements/editor/EditorJS";

type AddProductFormProps = {
  session: Session | null;
};

const AddProductForm: React.FC<AddProductFormProps> = ({ session }) => {
  const router = useRouter();

  const [productTypes, setProductTypes] = useState<IAddProductTypes[]>([]);
  //const [description, setDescription] = useState<OutputData | null>(null);
  const [priceInputFormated, setPriceInputFormated] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
    setValue,
  } = useForm<IAddProductZodSchema>({
    resolver: zodResolver(AddProductZodSchema),
  });

  // GET PRODUCT TYPE
  React.useEffect(() => {
    const fetchApi = async () => {
      const res = await getProductTypes();
      setProductTypes(res);
    };
    fetchApi();
  }, []);

  const onSubmit = async (data: IAddProductZodSchema) => {
    data = {
      ...data,
      sellerId: session?.user._id || "",
    };
    const res = await addProduct(data);
    if (res) {
      toast.success(`Đã thêm thành công sản phẩm ${getValues("name")}`);
      router.push("/");
    } else {
      toast.error("Có lỗi trong quá trình thêm sản phẩm");
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = parseFloat(e.target.value);
    setValue("price", numericValue);
    if (numericValue && !isNaN(numericValue)) {
      const formattedPrice = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(numericValue);

      // Cập nhật giá trị vào trạng thái priceInput
      const formattedPriceWithUnit = `${formattedPrice}/Kg`;
      setPriceInputFormated(formattedPriceWithUnit);
    } else {
      setPriceInputFormated("");
    }
  };

  return (
    <form className="mt-7 px-2" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col sm:!flex-row sm:gap-5">
        <div className="flex flex-col gap-4 w-full">
          <Input
            isRequired
            type="text"
            label="Tên sản phẩm"
            placeholder="Nhập tên sản phẩm"
            className="max-w-full"
            {...register("name")}
            isInvalid={!!errors.name}
            errorMessage={errors.name && errors.name.message}
          />

          {/* Loại sản phẩm */}
          <div className="flex items-center">
            <Select
              items={productTypes}
              label="Loại sản phẩm"
              placeholder="Chọn loại sản phẩm"
              className="max-w-full"
              isRequired
              {...register("productType")}
              isInvalid={!!errors.productType}
              errorMessage={errors.productType && errors.productType.message}
            >
              {(type) => <SelectItem key={type._id}>{type.name}</SelectItem>}
            </Select>
            <ProductTypes
              id={session?.user._id}
              productTypes={productTypes}
              setProductTypes={setProductTypes}
            />
          </div>

          {/* Số lượng sp */}
          <Input
            isRequired
            type="number"
            label="Số lượng sản phẩm"
            placeholder="0"
            className="max-w-full"
            endContent={
              <div className="flex items-center">
                <label className="sr-only" htmlFor="unit">
                  unit
                </label>
                <select
                  className="outline-none border-0 bg-transparent text-default-400 text-small"
                  id="unit"
                  name="unit"
                >
                  <option>Kg</option>
                  <option>Tấn</option>
                </select>
              </div>
            }
            {...register("quantity")}
            isInvalid={!!errors.quantity}
            errorMessage={errors.quantity && errors.quantity.message}
          />

          {/* Giá sản phẩm */}
          <Input
            isRequired
            type="number"
            label="Giá sản phẩm"
            placeholder="0"
            className="max-w-full"
            endContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">
                  {priceInputFormated}
                </span>
              </div>
            }
            {...register("price")}
            isInvalid={!!errors.price}
            errorMessage={errors.price && errors.price.message}
            onChange={handlePriceChange}
          />
        </div>

        <div className="w-full sm:max-w-[50%] mb-2">
          {/* Mô tả sản phẩm */}
          {/* <Textarea
            label="Mô tả sản phẩm"
            labelPlacement="outside"
            placeholder="Nhập mô tả sản phẩm"
            className="max-w-xs"
          /> */}
          <Editor getValues={getValues} setValue={setValue} />
          {errors.description && (
            <p className="text-rose-500 font-bold">Phải có mô tả sản phẩm</p>
          )}
        </div>
      </div>

      {/* Hình ảnh */}
      <FileUpload
        endpoint="productImages"
        getValue={getValues}
        setValue={setValue}
      />
      {errors.images && (
        <p className="text-rose-500 text-center font-bold">
          Phải có ít nhất một hình ảnh
        </p>
      )}

      <Button type="submit">Thêm sản phẩm</Button>
    </form>
  );
};

export default AddProductForm;
