"use client";

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button, Input, Select, SelectItem, Switch, cn, Spinner, Card, CardHeader, CardBody, Divider, Link } from "@nextui-org/react";
import toast from "react-hot-toast";
import { Session } from "next-auth";

import FileUpload from "@/components/elements/FileUpload";
import { addProduct, editProduct, getProductTypes } from "@/actions/products";
import {
  AddProductZodSchema,
  type IAddProductZodSchema,
} from "@/lib/zodSchema/products";
import ProductTypes from "../modal/ProductTypes";
import { unit } from "@/lib/constant/unit";
import Tiptap from "../elements/Editor";
import { IProduct } from "@/lib/models/products";

type AddProductFormProps = {
  session: Session | null;
  edit?: boolean;
  productId?: string;
  onClose?: () => void
  productData?: IProduct | null
};

const AddProductForm: React.FC<AddProductFormProps> = ({ session, edit = false, productId, onClose, productData }) => {
  const [productTypes, setProductTypes] = useState<IAddProductTypes[]>([]);
  const [retail, setRetail] = useState<boolean>(true);
  const [specialty, setSpecialty] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [priceInputFormated, setPriceInputFormated] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue,
    control
  } = useForm<IAddProductZodSchema>({
    defaultValues: {
      productType: productData?.productType || "",
      name: productData?.name || "",
      packageOptions: productData?.packageOptions
        ? productData?.packageOptions.map(packageOption => packageOption) : [{
          unit: "kg",
          weight: 0,
          price: 0,
          length: 0,
          width: 0,
          height: 0,
        }],
      retailPrice: productData?.retailPrice || 0,
      retail: productData?.retail || true,
      specialty: productData?.specialty || false,
      images: productData?.images || [],
      quantity: productData?.quantity || 0,
      unit: "kg",
    },
    resolver: zodResolver(AddProductZodSchema),
  });

  const { fields, append, remove } = useFieldArray({
    rules: {
      minLength: 1
    },
    control,
    name: "packageOptions",
  });

  React.useEffect(() => {
    if (productData) {
      setRetail(productData?.retail)
      setSpecialty(productData?.specialty)
    }
  }, [productData])

  // GET PRODUCT TYPE
  React.useEffect(() => {
    const fetchApi = async () => {
      const res = await getProductTypes();
      setProductTypes(res);
    };
    fetchApi();
  }, []);

  const onSubmit = async (data: IAddProductZodSchema) => {
    if (session?.user.shopId) {
      data = {
        ...data,
        shopId: session?.user.shopId,
        specialty: specialty
      };
      if (edit && productId) {
        const res = await editProduct(productId, data, session.user.accessToken);
        if (res.code === 200) {
          toast.success(res.message);
          onClose!();
        } else {
          toast.error(res.message);
        }
      } else {
        setIsLoading(true)
        const res = await addProduct(JSON.stringify(data));
        setIsLoading(false)
        if (res.code === 200) {
          toast.success(res.message);
          reset
          return
        }

        if (res.code === 500) {
          toast.error(res.message);
          return
        }
      }
    } else {
      toast.error("Lỗi lấy id shop vui lòng thử lại");
      return
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = parseFloat(e.target.value);
    setValue("retailPrice", numericValue);
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

  const handleRetail = (isSelected: boolean) => {
    setValue("specialty", isSelected)
    setRetail(isSelected)
  }

  const handleSpecialty = (isSelected: boolean) => {
    setValue("specialty", isSelected)
    setSpecialty(isSelected)
  }

  return (
    <form className="mt-7 px-2" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col sm:!flex-row gap-5 mb-3">
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

          <Switch
            classNames={{
              base: cn(
                "inline-flex flex-row-reverse !w-full !max-w-full bg-content1 hover:bg-content2 items-center",
                "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
                "data-[selected=true]:border-primary",
              ),
              wrapper: "p-0 h-4 overflow-visible",
              thumb: cn("w-6 h-6 border-2 shadow-lg",
                "group-data-[hover=true]:border-primary",
                //selected
                "group-data-[selected=true]:ml-6",
                // pressed
                "group-data-[pressed=true]:w-7",
                "group-data-[selected]:group-data-[pressed]:ml-4",
              ),
            }}
            defaultSelected={specialty}
            onValueChange={handleSpecialty}
          >
            <div className="flex flex-col gap-1">
              <p className="text-medium">Đặc sản</p>
              <p className="text-tiny text-default-400">
                <span>Sản phẩm đặc sản sẻ được hiển thị ở trang OCOP. </span>
                {
                  specialty && <>
                    <br />
                    <span className="font-semibold">
                      Vui lòng đặt tên sản phẩm có chứa tên của đặc sản.
                    </span>
                    <br />
                    <span className="!text-primary font-semibold">
                      Ví dụ:
                      <span className="font-bold"> Cá kèo </span>
                      tươi ngon
                    </span>
                    <br />
                    <span className="font-semibold text-danger">
                      Lưu lý nếu đặt tên sai cách sản phẩm của bạn có thể sẻ không được hiện trong trang OCOP
                    </span>
                    <br />
                    <Link
                      isExternal
                      showAnchorIcon
                      color="success"
                      size="sm"
                      href={"/specialty"}
                    >
                      Xem tên đặc sản tại đây
                    </Link>
                  </>
                }
              </p>
            </div>
          </Switch>


          {/* Loại sản phẩm */}
          <div className="flex items-center">
            <Select
              items={productTypes}
              label="Loại sản phẩm"
              className="max-w-full"
              isRequired
              {...register("productType")}
              isInvalid={!!errors.productType}
              errorMessage={errors.productType && errors.productType.message}
              defaultSelectedKeys={[`${productData?.productType || ""}`]}
            >
              {(type) => <SelectItem key={type._id}>{type.name}</SelectItem>}
            </Select>

            <ProductTypes
              id={session?.user.shopId}
              productTypes={productTypes}
              setProductTypes={setProductTypes}
            />
          </div>

          {/* Số lượng sp */}
          <Card>
            <CardHeader>Số lượng sản phẩm</CardHeader>
            <Divider />
            <CardBody className="flex flex-col gap-3">
              <Select
                items={unit}
                isRequired
                label="Chọn đơn vị tính"
                placeholder="Chọn đơn vị tính"
                className="max-w-full"
                {...register("unit")}
                isInvalid={!!errors.unit}
                errorMessage={errors.unit && errors.unit.message}
                defaultSelectedKeys={["kg"]}
              >
                {(unit) => <SelectItem key={unit.name}>{unit.name}</SelectItem>}
              </Select>

              <Input
                isRequired
                type="number"
                label="Số lượng sản phẩm"
                placeholder="0"
                className="max-w-full"
                {...register("quantity")}
                isInvalid={!!errors.quantity}
                errorMessage={errors.quantity && errors.quantity.message}
              />
            </CardBody>
          </Card>

          {/* Gói sản phẩm */}
          <Card shadow="sm">
            <CardHeader>
              Gói sản phẩm
            </CardHeader>
            <Divider />
            <CardBody className="flex flex-col gap-5">
              {
                fields.map((field, i) => {
                  return (
                    <div key={field.id} className="flex flex-col gap-3">
                      <h4>Gói {i + 1}</h4>

                      <Select
                        items={unit}
                        isRequired
                        label="Chọn đơn vị tính"
                        placeholder="Chọn đơn vị tính"
                        className="max-w-full"
                        {...register(`packageOptions.${i}.unit`)}
                        defaultSelectedKeys={[`${productData?.packageOptions && productData?.packageOptions[i]?.unit || "kg"}`]}
                      >
                        {(unit) => <SelectItem key={unit.name}>{unit.name}</SelectItem>}
                      </Select>

                      <Input
                        label="Cân nặng"
                        isRequired
                        type="number"
                        placeholder="0"
                        {...register(`packageOptions.${i}.weight`, { valueAsNumber: true })}
                      />

                      <Input
                        label="Giá"
                        isRequired
                        type="number"
                        placeholder="0"
                        {...register(`packageOptions.${i}.price`, { valueAsNumber: true })}
                      />

                      <Input
                        label="Chiều dài sau khi đóng gói (cm)"
                        isRequired
                        type="number"
                        max={150}
                        placeholder="Tối đa 150cm"
                        {...register(`packageOptions.${i}.length`, { valueAsNumber: true })}
                      />

                      <Input
                        label="Chiều rộng sau khi đóng gói (cm)"
                        isRequired
                        type="number"
                        max={150}
                        placeholder="Tối đa 150cm"
                        {...register(`packageOptions.${i}.width`, { valueAsNumber: true })}
                      />

                      <Input
                        label="Chiều cao sau khi đóng gói (cm)"
                        isRequired
                        type="number"
                        max={150}
                        placeholder="Tối đa 150cm"
                        {...register(`packageOptions.${i}.height`, { valueAsNumber: true })}
                      />

                      <Button
                        variant="flat"
                        color="danger"
                        onClick={() => remove(i)}
                      >
                        Xoá
                      </Button>
                    </div>
                  )
                })
              }
              <Button
                variant="flat"
                color="success"
                onClick={() => append({
                  unit: "kg",
                  weight: 0,
                  price: 0,
                  height: 0,
                  length: 0,
                  width: 0
                })}
              >
                Thêm gói
              </Button>
            </CardBody>
          </Card>
        </div>

        <div className="w-full sm:max-w-[50%] flex flex-col gap-4">
          {/* Bán lẻ */}
          <Switch
            classNames={{
              base: cn(
                "inline-flex flex-row-reverse !w-full !max-w-full bg-content1 hover:bg-content2 items-center",
                "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
                "data-[selected=true]:border-primary",
              ),
              wrapper: "p-0 h-4 overflow-visible",
              thumb: cn("w-6 h-6 border-2 shadow-lg",
                "group-data-[hover=true]:border-primary",
                //selected
                "group-data-[selected=true]:ml-6",
                // pressed
                "group-data-[pressed=true]:w-7",
                "group-data-[selected]:group-data-[pressed]:ml-4",
              ),
            }}
            defaultSelected={retail}
            onValueChange={handleRetail}
          >
            <div className="flex flex-col gap-1">
              <p className="text-medium">Cho phép bán lẻ</p>
              <p className="text-tiny text-default-400">
                Người khác sẻ có thể mua sản phẩm của bạn với số lượng ngoài các gói đã tạo trước.
              </p>
            </div>
          </Switch>

          {/* Giá bán lẻ */}
          <Input
            isRequired
            type="number"
            label="Giá bán lẻ"
            placeholder="0"
            className="max-w-full"
            isDisabled={!retail}
            endContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">
                  {priceInputFormated}
                </span>
              </div>
            }
            {...register("retailPrice")}
            isInvalid={!!errors.retailPrice}
            errorMessage={errors.retailPrice && errors.retailPrice.message}
            onChange={handlePriceChange}
          />

          <Tiptap getValues={getValues} setValue={setValue} initialValue={productData?.description || ""} />

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

      <div className="flex justify-end py-3 gap-3">
        {
          edit && onClose && (
            <Button variant="bordered" onPress={() => onClose()}>
              Huỷ
            </Button>
          )
        }

        <Button type="submit" color="success" isDisabled={isLoading}>
          {
            isLoading && <Spinner size="sm" color="default" />
          }
          {
            edit ? "Cập nhật sản phẩm" : "Thêm sản phẩm"
          }
        </Button>
      </div>
    </form>
  );
};

export default AddProductForm;
