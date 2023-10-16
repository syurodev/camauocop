"use client"
import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, Select, SelectItem, Card, CardHeader, CardBody, Image, Input, Button, Divider, useDisclosure, ModalFooter } from "@nextui-org/react";
import { LuArrowRight } from "react-icons/lu"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IOrderZodSchema, OrderZodSchema } from "@/lib/zodSchema/order";

import { formattedPriceWithUnit } from "@/lib/formattedPriceWithUnit";
import DeliveryCard from "../card/DeliveryCard";
import { unit } from "@/lib/constant/unit";
import { convertWeight } from "@/lib/convertWeight";
import { getGHNServiceFee } from "@/actions/delivery";
import { createOrder } from "@/actions/order";
import { Session } from "next-auth";
import toast from "react-hot-toast";
import { useAppSelector } from "@/redux/store";

type IProps = {
  isOpenBuyModal: boolean;
  onCloseBuyModal: () => void;
  onOpenChangeBuyModal: () => void;
  session: Session
}

const BuyModal: React.FC<IProps> = ({ isOpenBuyModal, onCloseBuyModal, onOpenChangeBuyModal, session }) => {
  // const [productsData, setProductsData] = React.useState<IProductDetail[] | null>(() => {
  //   if (data === null) {
  //     return null;
  //   } else if (Array.isArray(data)) {
  //     return data;
  //   } else {
  //     return [data];
  //   }
  // });
  const [provinceId, setProvinceId] = React.useState<number>(0)
  const [districtId, setDistrictId] = React.useState<number>(0)
  const [wardId, setWardId] = React.useState<string>("0")
  const [retail, setRetail] = React.useState<{ [key: string]: boolean }>({})
  const [selectedUnits, setSelectedUnits] = React.useState<{ [key: string]: WeightUnit }>({});
  const [packSeleced, setPackSeleced] = React.useState<{ [key: string]: ProductPack }>({});
  const [productWeightState, setProductWeightState] = React.useState<{ [key: string]: number }>({});
  const [productWeight, setProductWeight] = React.useState<{ [key: string]: number }>({});
  const [productQuantity, setProductQuantity] = React.useState<{ [key: string]: number }>({});
  const [deliveryServiceFee, setDeliveryServiceFee] = React.useState<number>(0)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)


  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const productsData = useAppSelector((state) => state.productsDetailReducer.value)

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
    setValue,
  } = useForm<IOrderZodSchema>({
    resolver: zodResolver(OrderZodSchema),
  });

  // Initial Value
  React.useEffect(() => {
    // initial state
    if (productsData && productsData.length > 0) {
      const defaultUnits: { [productId: string]: WeightUnit } = {};
      const defaultQuantitiesState: { [productId: string]: number } = {};
      const defaultQuantities: { [productId: string]: number } = {};
      const defaultWeight: { [productId: string]: number } = {};
      const defaultRetails: { [productId: string]: boolean } = {};
      const defaultPacks: { [productId: string]: ProductPack } = {};
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
          setValue(`products.${index}.retail`, false)
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
  };

  // const calculateProductPrice = (product: IProductDetail, retail: boolean, quantity: number, unit: WeightUnit) => {
  //   if (product) {
  //     if (retail) {
  //       let currentQuantity = quantity
  //       let quantityPack = 0
  //       let totalPrice = 0;

  //       const sortedPacks = [...product.packageOptions].sort((a, b) => b.weight - a.weight);

  //       for (const packOption of sortedPacks) {
  //         let quantityInPackUnit = 0
  //         if (unit === packOption.unit) {
  //           quantityInPackUnit = quantity
  //         } else {
  //           quantityInPackUnit = convertWeight(quantity, unit, packOption.unit)
  //           currentQuantity = quantityInPackUnit
  //         }

  //         if (quantityInPackUnit >= packOption.weight) {
  //           // Số lượng pack có thể mua
  //           const numPacks = Math.floor(quantityInPackUnit / packOption.weight);

  //           quantityPack = packOption.weight * numPacks

  //           // Cộng totalPrice bằng giá của pack
  //           totalPrice += numPacks * packOption.price;

  //           // Trừ quantity theo số lượng mua được
  //           quantity -= numPacks * packOption.weight;
  //         }
  //       }

  //       // Kiểm tra quantity còn lớn hơn 0 không
  //       if (currentQuantity - quantityPack > 0) {
  //         // Kiểm tra unit của quantity có phải là kg không
  //         if (unit === "kg") {
  //           // Nhân quantity còn lại với giá bán lẻ của 1kg
  //           totalPrice += (currentQuantity - quantityPack) * product.productPrice;
  //         } else {
  //           // Chuyển quantity về kg
  //           const quantityInKg = convertWeight((currentQuantity - quantityPack), unit, "kg");
  //           // Nhân quantity còn lại với giá bán lẻ của 1kg
  //           totalPrice += quantityInKg * product.productPrice;
  //         }
  //       }

  //       return totalPrice;
  //     }
  //   } else {
  //     return 0
  //   }
  // };

  const handleWeightChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    product: IProductDetail,
    weight: number,
    index: number,
    productPrice: number,
  ) => {
    const inputWeight = e.target.value

    if (+inputWeight >= weight) {
      setValue(`products.${index}.weight`, weight)
      setValue(`products.${index}.price`, +formattedPriceWithUnit(
        productPrice,
        selectedUnits[product?._id!],
        weight,
        true
      ))
      // setValue(`products.${index}.price`, calculateProductPrice(product, true, weight, selectedUnits[product?._id!]) || 0)

      setProductWeight((prewWeight) => ({
        ...prewWeight,
        [product?._id!]: weight,
      }))
      return
    }

    if (+inputWeight <= 0) {
      setValue(`products.${index}.weight`, 0)
      setProductWeight((prewWeight) => ({
        ...prewWeight,
        [product?._id!]: 0,
      }))
      setValue(`products.${index}.price`, +formattedPriceWithUnit(
        productPrice,
        selectedUnits[product?._id!],
        0,
        true
      ))

      // setValue(`products.${index}.price`, calculateProductPrice(product, true, 0, selectedUnits[product?._id!]) || 0)
      return
    }

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
          // setValue(`products.${index}.package`, {
          //   unit: packOption.unit,
          //   weight: packOption.weight,
          //   price: packOption.price
          // })
        }
      });
    }
  }

  // Lấy phí vận chuyển
  React.useEffect(() => {
    const handleGetDeliveryFee = async () => {
      let totalWeight = 0
      const transformedArray = productsData!.map((product, index) => {
        let name = product?.productName!;
        let quantity = 1;
        let weight = 0;
        let length = 0;
        let width = 0;
        let height = 0;

        if (retail[product?._id!]) {
          if (selectedUnits[product?._id!] === "gram") {
            weight = productWeight[product?._id!]
            totalWeight += productWeight[product?._id!] * productQuantity[product?._id!]
          } else {
            weight = convertWeight(productWeight[product?._id!], selectedUnits[product?._id!], "gram")
            totalWeight += convertWeight(productWeight[product?._id!], selectedUnits[product?._id!], "gram") * productQuantity[product?._id!]
          }
        } else {
          length = +packSeleced[product?._id!].length
          width = +packSeleced[product?._id!].width
          height = +packSeleced[product?._id!].height
          quantity = productQuantity[product?._id!]

          if (packSeleced[product?._id!].unit === "gram") {
            weight = packSeleced[product?._id!].weight
            totalWeight += packSeleced[product?._id!].weight * productQuantity[product?._id!]
          } else {
            weight = convertWeight(packSeleced[product?._id!].weight, packSeleced[product?._id!].unit, "gram")

            totalWeight += convertWeight(packSeleced[product?._id!].weight, packSeleced[product?._id!].unit, "gram") * productQuantity[product?._id!]
          }
        }

        return {
          name,
          quantity,
          weight,
          length,
          width,
          height,
        }
      })

      if (getValues("delivery")[0] === "Giao hàng nhanh") {
        const res = await getGHNServiceFee({
          shop_id: productsData![0]?.shopInfo.shop_id.GHN!,
          to_district_id: districtId,
          to_ward_code: wardId,
          items: transformedArray,
          weight: totalWeight
        })

        if (res && res.code === 200) {
          setDeliveryServiceFee(res.data?.total!)
        }
      }
    }
    if (isOpenBuyModal) {
      if (productsData && productsData.length > 0) {
        handleGetDeliveryFee()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [districtId,
    wardId,
    retail,
    selectedUnits,
    packSeleced,
    productWeight,
    productsData,
    isOpenBuyModal,
    productQuantity
  ])

  const onSubmit = async (formData: IOrderZodSchema) => {
    setIsLoading(true)
    let total = 0
    let shopId = ""
    productsData && productsData.map((product) => {
      shopId = product?.shopId!
      if (retail[product?._id!]) {
        total += +formattedPriceWithUnit(
          product?.productPrice!,
          selectedUnits[product?._id!],
          productWeight[product?._id!],
          true
        )
      } else {
        total += packSeleced[product?._id!].price * productQuantity[product?._id!]
      }
    })

    formData.totalAmount = total + deliveryServiceFee
    formData.shopId = shopId
    formData.buyerId = session.user._id

    const res = await createOrder(formData)
    setIsLoading(false)
    if (res.code === 200) {
      toast.success(res.message)
      onCloseBuyModal()
    }

    if (res.code === 500) {
      toast.error(res.message)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Modal
        isOpen={isOpenBuyModal}
        onOpenChange={onOpenChangeBuyModal}
        scrollBehavior="outside"
        size="5xl"
        placement="bottom"
        backdrop="blur"
        isKeyboardDismissDisabled
        classNames={{
          base: "!max-w-[98%] !h-[95%] mx-2 !mb-0 !absolute !bottom-0 !rounded-b-none !overflow-auto"
        }}
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.2,
                ease: "easeOut",
              },
            },
            exit: {
              y: 20,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: "easeIn",
              },
            },
          }
        }}
      >
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalHeader>
                Mua hàng
              </ModalHeader>

              <ModalBody className="flex gap-3 flex-col md:flex-row w-full">
                <Card shadow="sm" className="flex-1">
                  <CardHeader>
                    Thông tin sản phẩm
                  </CardHeader>
                  <Divider />
                  <CardBody>
                    <div className="flex flex-col gap-4">
                      {
                        productsData && productsData.length > 0 && productsData.map((product, index) => {
                          return (
                            <div className="flex flex-col gap-2" key={product?._id}>
                              <div className="flex flex-row gap-2 mb-2">
                                <Image
                                  src={product?.productImages[0]}
                                  alt={product?.productName}
                                  width={50}
                                  height={50}
                                  radius="lg"
                                  className="object-cover w-12 h-12 rounded-full shadow-sm"
                                />
                                <div>
                                  <h4 className="font-medium">{product?.productName}</h4>
                                  <div className="flex flex-row items-center justify-between">
                                    <h4 className="text-primary">{product?.productPrice ?
                                      `Giá bán lẻ: ${formattedPriceWithUnit(product?.productPrice)}`
                                      : "Không có giá bán lẻ"}
                                    </h4>
                                  </div>
                                </div>
                              </div>
                              {product?.productPrice! > 0 && <Button
                                variant="bordered"
                                onPress={() => swarpMode(product?._id!, retail[product?._id!], index)}
                              >
                                {retail[product?._id!] ? "Chọn gói" : "Mua lẻ"}
                              </Button>}

                              {
                                retail[product?._id!] ? (
                                  <div className="flex flex-col gap-3">
                                    <Select
                                      isRequired
                                      items={unit}
                                      label="Chọn đơn vị tính"
                                      className="max-w-full"
                                      onSelectionChange={(keys) => handleUnitChange(product?._id!, Array.from(keys)[0].toString() as WeightUnit, index)}
                                    >
                                      {(unit) => <SelectItem key={unit.name}>{unit.name}</SelectItem>}
                                    </Select>

                                    <Input
                                      isRequired
                                      type="number"
                                      label="Số lượng"
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
                                      items={product?.packageOptions}
                                      label="Chọn gói"
                                      className="max-w-full"
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
                                      type="number"
                                      label="Số lượng gói"
                                      isInvalid={!!errors.products?.[index]?.quantity}
                                      errorMessage={errors.products?.[index]?.quantity?.message}
                                      {...register(`products.${index}.quantity`)}
                                      value={productQuantity[product?._id!].toString()}
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
                            </div>
                          )
                        })
                      }
                    </div>
                  </CardBody>
                </Card>

                <div className="flex-1 flex gap-3 flex-col">
                  <DeliveryCard
                    label="Giao hàng"
                    selectionMode={"single"}
                    showList={true}
                    registerApartment={{ ...register("apartment") }}
                    registerDelivery={{ ...register("delivery") }}
                    registerProvince={{ ...register("province") }}
                    registerDistrict={{ ...register("district") }}
                    registerWard={{ ...register("ward") }}
                    getValues={getValues}
                    setValue={setValue}
                    errors={errors}
                    setProvinceId={setProvinceId}
                    setDistrictId={setDistrictId}
                    setWardId={setWardId}
                  />

                  <Card shadow="sm">
                    <CardHeader>
                      Tổng tiền
                    </CardHeader>

                    <Divider />

                    <CardBody className="flex flex-col gap-3">
                      {
                        productsData && productsData.length > 0 && productsData.map((product, index) => {
                          return (
                            <div key={product?._id}>
                              <p>{product?.productName}</p>
                              {
                                retail[product?._id!] ? (
                                  <div className="flex flex-row items-center justify-between">
                                    <span className="font-semibold text-primary">
                                      {
                                        formattedPriceWithUnit(product?.productPrice!, selectedUnits[product?._id!], productWeight[product?._id!])
                                      }
                                    </span>
                                    <span className="font-medium text-xs opacity-70">{productWeight[index || 0]}{selectedUnits[product?._id!]}</span>
                                  </div>

                                ) : (
                                  <div className="flex flex-row items-center justify-between">
                                    <span className="font-semibold text-primary">
                                      {
                                        formattedPriceWithUnit(packSeleced[product?._id!].price * productQuantity[product?._id!])
                                      }
                                    </span>
                                    <span className="font-medium text-xs opacity-70">{packSeleced[product?._id!].weight * productQuantity[product?._id!]}{packSeleced[product?._id!].unit}</span>
                                  </div>
                                )
                              }
                            </div>
                          )
                        })
                      }

                      <div>
                        <h4>Phí vận chuyển</h4>
                        <div className="flex flex-row items-center justify-between">
                          <span className="font-semibold text-primary">{formattedPriceWithUnit(deliveryServiceFee)}</span>
                          <div className="flex flex-row items-center w-fit">
                            <span className="font-medium text-xs opacity-70">{productsData![0]?.shopInfo.address[0].province}</span>
                            <LuArrowRight />
                            <span className="font-medium text-xs opacity-70">{getValues("province")}</span>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </div>

                {/* <Card>
                  <CardHeader>
                    Hình thức thanh toán
                  </CardHeader>
                  <Divider />
                  <CardBody>

                  </CardBody>
                </Card> */}
              </ModalBody>

              <ModalFooter>
                <Button variant="bordered" onPress={onClose}>Huỷ</Button>
                <Button color="success" type="submit">Mua</Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default React.memo(BuyModal)