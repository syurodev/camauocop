"use client"
import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { AiOutlineEdit } from "react-icons/ai"
import { Button, Input, Popover, PopoverContent, PopoverTrigger, Select, SelectItem, Spinner } from '@nextui-org/react';
import toast from 'react-hot-toast';

import { useAppSelector } from '@/redux/store'
import { unit } from '@/lib/constant/unit';
import { convertWeight } from '@/lib/convertWeight';
import { formattedPriceWithUnit } from '@/lib/formattedPriceWithUnit';
import { BookZodSchema, IBookZodSchema } from '@/lib/zodSchema/order';
import { createBook } from '@/actions/order';

type IProps = {
  setIsBookOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const Book: React.FC<IProps> = ({ setIsBookOpen }) => {

  const productsData: IProductDetail[] | null = useAppSelector(state => state.productsDetailReducer.value)
  const session = useAppSelector(state => state.sessionReducer.value)
  const [selectedUnits, setSelectedUnits] = React.useState<{ [key: string]: WeightUnit }>({});
  const [productWeightState, setProductWeightState] = React.useState<{ [key: string]: number }>({});
  const [productWeight, setProductWeight] = React.useState<{ [key: string]: number }>({});
  const [productQuantity, setProductQuantity] = React.useState<{ [key: string]: number }>({});
  const [retail, setRetail] = React.useState<{ [key: string]: boolean }>({})
  const [packSeleced, setPackSeleced] = React.useState<{ [key: string]: ProductPack }>({});
  const [total, setTotal] = React.useState<number>(0);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<IBookZodSchema>({
    resolver: zodResolver(BookZodSchema),
    defaultValues: ({
      buyerId: session?.user._id,
      shopId: productsData![0].shopId || "",
      orderType: "book",
    })
  });

  // Initial Value
  React.useEffect(() => {
    // initial state
    const defaultUnits: { [productId: string]: WeightUnit } = {};
    const defaultQuantitiesState: { [productId: string]: number } = {};
    const defaultQuantities: { [productId: string]: number } = {};
    const defaultWeight: { [productId: string]: number } = {};
    const defaultRetails: { [productId: string]: boolean } = {};
    const defaultPacks: { [productId: string]: ProductPack } = {};

    if (productsData && productsData.length > 0) {
      productsData.forEach((product, index) => {
        if (product && product._id) {
          defaultUnits[product._id] = "kg";
          defaultQuantitiesState[product._id] = product.productQuantity;
          defaultRetails[product._id] = false;
          defaultQuantities[product._id] = 1;
          defaultWeight[product._id] = 0;
          defaultPacks[product._id] = {
            unit: "kg",
            price: 0,
            weight: 0,
            width: 0,
            length: 0,
            height: 0,
          };

          setValue(`products.${index}.productId`, product?._id!)
          setValue(`products.${index}.retail`, true)
          setValue(`products.${index}.quantity`, 1)
          setValue(`products.${index}.weight`, 0)
          setValue(`products.${index}.price`, product.productPrice)
        }
      });
      setProductQuantity(defaultQuantities)
      setSelectedUnits(defaultUnits);
      setProductWeightState(defaultQuantitiesState)
      setRetail(defaultRetails)
      setPackSeleced(defaultPacks)
      setProductWeight(defaultWeight)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productsData]);

  React.useEffect(() => {
    productsData && productsData.map((product) => {
      if (retail[product?._id!]) {
        if (productQuantity[product?._id!]) {
          setTotal(+formattedPriceWithUnit(
            product?.productPrice!,
            selectedUnits[product?._id!],
            productWeight[product?._id!],
            true
          ))
        }
      } else {
        if (packSeleced[product?._id!]) {
          setTotal(packSeleced[product?._id!]?.price * productQuantity[product?._id!])
        }
      }
    })
  }, [selectedUnits, productWeight, productsData, packSeleced, retail, productQuantity])

  const handleUnitChange = (productId: string, unit: WeightUnit, index: number) => {
    const weight = convertWeight(productWeightState[productId], selectedUnits[productId], unit)

    setValue(`products.${index}.unit`, unit)

    setSelectedUnits((prevSelectedUnits) => ({
      ...prevSelectedUnits,
      [productId]: unit,
    }));

    setProductWeightState((prevProductWeightState) => ({
      ...prevProductWeightState,
      [productId]: weight,
    }));

    setValue(`products.${index}.weight`, 0)
    setValue(`products.${index}.price`, 0)
    // setValue(`products.${index}.price`, calculateProductPrice(product, true, weight, selectedUnits[product?._id!]) || 0)

    setProductWeight((prewWeight) => ({
      ...prewWeight,
      [productId]: 0,
    }))
  };

  const handleWeightChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    product: IProductDetail,
    weight: number,
    index: number,
    productPrice: number,
  ) => {
    const inputWeight = e.target.value

    setValue(`products.${index}.weight`, +inputWeight)
    setProductWeight((prewWeight) => ({
      ...prewWeight,
      [product?._id!]: +inputWeight,
    }))

    setValue(`products.${index}.price`, +formattedPriceWithUnit(
      productPrice,
      selectedUnits[product?._id!],
      +inputWeight,
      true
    ))

    // setValue(`products.${index}.price`, calculateProductPrice(product, true, +inputWeight, selectedUnits[product?._id!]) || 0)
  }

  const swarpMode = (productId: string, retail: boolean, index: number) => {

    setValue(`products.${index}.retail`, !retail)

    if (retail) {
      setProductWeight((prevWeight) => ({
        ...prevWeight,
        [productId]: 0,
      }))
      setValue(`products.${index}.weight`, 0)
    }

    setRetail((prevRetail) => ({
      ...prevRetail,
      [productId]: !retail,
    }))
  }

  const handlePackChange = (productId: string, index: number, price: number) => {
    const product = productsData!.find((item) => item?._id! === productId);

    if (product) {
      product.packageOptions.forEach((packOption, i) => {
        if (packOption.price === price) {
          setPackSeleced((prevPackSeleced) => ({
            ...prevPackSeleced,
            [productId]: {
              unit: packOption.unit,
              weight: packOption.weight,
              price: packOption.price,
              length: packOption.length,
              height: packOption.height,
              width: packOption.width
            } as ProductPack
          }))

          setValue(`products.${index}.weight`, packOption.weight)
          setValue(`products.${index}.unit`, packOption.unit)
          setValue(`products.${index}.price`, packOption.price)
          setValue(`products.${index}.length`, packOption.length)
          setValue(`products.${index}.width`, packOption.width)
          setValue(`products.${index}.height`, packOption.height)
        }
      });
    }
  }

  const onSubmit = async (data: IBookZodSchema) => {
    data.totalAmount = total
    setIsSubmitting(true)
    const res = await createBook(session?.user.accessToken!, data)
    setIsSubmitting(false)

    if (res.code === 200) {
      toast.success(res.message)
      setIsBookOpen(false)
    } else {
      toast.error(res.message)
    }
  }

  return (
    <div className='min-w-[300px]'>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3'>
        {
          productsData && productsData.length > 0 && productsData.map((product, index) => {
            return (
              <>
                <Button
                  key={`swapButton${product._id}`}
                  variant="bordered"
                  onPress={() => swarpMode(product?._id!, retail[product?._id!], index)}
                >
                  {retail[product?._id!] ? "Chọn gói" : "Mua lẻ"}
                </Button>

                {
                  retail[product?._id!] ? (
                    <div
                      className="flex flex-col gap-3"
                      key={`productretail${product._id}`}
                    >
                      <Select
                        isRequired
                        items={unit}
                        label="Chọn đơn vị tính"
                        className="max-w-full shadow-sm"
                        onSelectionChange={(keys) => handleUnitChange(product?._id!, Array.from(keys)[0].toString() as WeightUnit, index)}
                      >
                        {(unit) => <SelectItem key={unit.name}>{unit.name}</SelectItem>}
                      </Select>

                      <Input
                        isRequired
                        type="number"
                        label="Số lượng"
                        className="max-w-full shadow-sm"
                        isInvalid={!!errors.products?.[index]?.weight}
                        errorMessage={errors.products?.[index]?.weight?.message}
                        {...register(`products.${index}.weight`)}
                        value={productWeight[product?._id!].toString()}
                        onChange={(e) => handleWeightChange(e, product!,
                          productWeightState[product?._id!], index, product?.productPrice!)}
                      />
                    </div>
                  ) : (
                    <>
                      <Select
                        isRequired
                        key={`productPack${index}`}
                        items={product?.packageOptions}
                        label="Chọn gói"
                        className="max-w-full shadow-sm"
                        variant="bordered"
                        isInvalid={!!errors.products}
                        classNames={{
                          label: "group-data-[filled=true]:-translate-y-5",
                          trigger: "min-h-unit-16",
                          listboxWrapper: "max-h-[400px]",
                        }}
                        listboxProps={{
                          itemClasses: {
                            base: [
                              "rounded-md",
                              "text-default-500",
                              "transition-opacity",
                              "data-[hover=true]:text-foreground",
                              "data-[hover=true]:bg-default-100",
                              "dark:data-[hover=true]:bg-default-50",
                              "data-[selectable=true]:focus:bg-default-50",
                              "data-[pressed=true]:opacity-70",
                              "data-[focus-visible=true]:ring-default-500",
                            ],
                          },
                        }}
                        popoverProps={{
                          classNames: {
                            base: "p-0 border-small border-divider bg-background",
                            arrow: "bg-default-200",
                          },
                        }}
                        renderValue={(items) => {
                          return items.map((item) => (
                            <div key={item.data?.price} className="flex items-center gap-2">
                              <div className="flex flex-col">
                                <span>{`${item.data?.weight} ${item.data?.unit}`}</span>
                                <span className="text-default-500 text-tiny">{item.data?.price}</span>
                              </div>
                            </div>
                          ));
                        }}
                        onSelectionChange={keys => handlePackChange(product?._id!, index, +Array.from(keys)[0])}
                      >
                        {(packageOptions) => (
                          <SelectItem key={packageOptions.price} textValue={`${packageOptions.weight} ${packageOptions.unit}`}>
                            <div className="flex gap-2 items-center">
                              <div className="flex flex-col">
                                <span className="text-small">{`${packageOptions.weight} ${packageOptions.unit}`}</span>
                                <span className="text-tiny text-default-400">{packageOptions.price}</span>
                              </div>
                            </div>
                          </SelectItem>
                        )}
                      </Select>

                      <Input
                        isRequired
                        key={`productpackinput${index}`}
                        type="number"
                        label="Số lượng gói"
                        className="max-w-full shadow-sm"
                        isInvalid={!!errors.products?.[index]?.quantity}
                        errorMessage={errors.products?.[index]?.quantity?.message}
                        {...register(`products.${index}.quantity`)}
                        value={productQuantity[product?._id!]?.toString() || "0"}
                        onChange={(e) => {
                          setProductQuantity((prevProductQuantity) => ({
                            ...prevProductQuantity,
                            [product?._id!]: +e.target.value
                          }))
                          setValue(`products.${index}.quantity`, +e.target.value)
                        }}
                      />
                    </>
                  )
                }

                <div className='flex flex-col items-start px-1'>
                  <p>Giá {total <= 0 && <span className='text-tiny text-warning'>(Giá phải lớn hơn 0)</span>}</p>
                  <div
                    className='flex flex-row gap-2 items-center'
                  >
                    <span className="font-semibold text-primary">
                      {
                        formattedPriceWithUnit(total)
                      }
                    </span>

                    <Popover
                      showArrow
                      offset={10}
                      placement="bottom"
                      backdrop='opaque'
                    >
                      <PopoverTrigger>
                        <Button
                          isIconOnly
                          size='sm'
                          variant='ghost'
                          className='border-none'
                          radius='full'
                          isDisabled={session?.user.role !== "shop"}
                        >
                          <AiOutlineEdit className="text-lg" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Input
                          value={total.toString()}
                          type='number'
                          onChange={e => setTotal(+e.target.value)}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </>
            )
          })
        }

        <Button
          color='success'
          type="submit"
          isDisabled={total <= 0 || isSubmitting}
        >
          {
            isSubmitting && (
              <Spinner size='sm' />
            )
          }
          Đặt
        </Button>
        {/* <p className='text-tiny'>Các đơn đặt trước sẻ bị huỷ sau 5 ngày nếu người bán không phản hồi</p> */}
      </form>
    </div>
  )
}

export default React.memo(Book)