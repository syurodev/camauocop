"use client"
import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, Select, SelectItem, Card, CardHeader, CardBody, Image, Input, Button, Divider, useDisclosure, ModalFooter } from "@nextui-org/react";
import { LuArrowRight, LuMinus, LuPlus } from "react-icons/lu"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IOrderZodSchema, OrderZodSchema } from "@/lib/zodSchema/order";

import { formattedPriceWithUnit } from "@/lib/formattedPriceWithUnit";
import DeliveryCard from "../card/DeliveryCard";
import { unit } from "@/lib/constant/unit";
import { convertWeight } from "@/lib/convertWeight";
import { getGHNServiceFee } from "@/actions/delivery";

type IProps = {
  isOpenBuyModal: boolean;
  onCloseBuyModal?: () => void;
  onOpenChangeBuyModal: () => void;
  data: (IProductDetail | null)[]
}

const BuyModal: React.FC<IProps> = ({ isOpenBuyModal, onCloseBuyModal, onOpenChangeBuyModal, data }) => {
  const [provinceId, setProvinceId] = React.useState<number>(0)
  const [districtId, setDistrictId] = React.useState<number>(0)
  const [wardId, setWardId] = React.useState<string>("0")
  const [retail, setRetail] = React.useState<{ [key: string]: boolean }>({})
  const [selectedUnits, setSelectedUnits] = React.useState<{ [key: string]: WeightUnit }>({});
  const [packSeleced, setPackSeleced] = React.useState<{ [key: string]: ProductPack }>({});
  const [productQuantitiesState, setProductQuantitiesState] = React.useState<{ [key: string]: number }>({});
  const [productQuantities, setProductQuantities] = React.useState<{ [key: string]: number }>({});
  const [deliveryServiceFee, setDeliveryServiceFee] = React.useState<number>(0)


  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

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

  React.useEffect(() => {
    // initial state
    if (data && data.length > 0) {
      const defaultUnits: { [productId: string]: WeightUnit } = {};
      const defaultQuantitiesState: { [productId: string]: number } = {};
      const defaultQuantities: { [productId: string]: number } = {};
      const defaultRetails: { [productId: string]: boolean } = {};
      const defaultPacks: { [productId: string]: ProductPack } = {};
      data.forEach((product, index) => {
        if (product && product._id) {
          defaultUnits[product._id] = "kg";
          defaultQuantitiesState[product._id] = product.productQuantity;
          defaultRetails[product._id] = false;
          defaultQuantities[product._id] = 0;
          defaultPacks[product._id] = {
            unit: "kg",
            price: 0,
            weight: 0
          };
          setValue(`products.${index}.productId`, product?._id!)
          setValue(`products.${index}.retail`, false)
        }
      });
      setSelectedUnits(defaultUnits);
      setProductQuantitiesState(defaultQuantitiesState)
      setRetail(defaultRetails)
      setPackSeleced(defaultPacks)
      setProductQuantities(defaultQuantities)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleUnitChange = (productId: string, unit: WeightUnit, index: number) => {
    const weight = convertWeight(productQuantitiesState[productId], selectedUnits[productId], unit)

    setValue(`products.${index}.unit`, unit)

    setSelectedUnits((prevSelectedUnits) => ({
      ...prevSelectedUnits,
      [productId]: unit,
    }));

    setProductQuantitiesState((prevProductQuantitiesState) => ({
      ...prevProductQuantitiesState,
      [productId]: weight,
    }));
  };

  const handleQuantityChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    productId: string,
    quantity: number,
    index: number
  ) => {
    const inputQuantities = e.target.value

    if (+inputQuantities >= quantity) {
      setValue(`products.${index}.quantity`, quantity)
      setProductQuantities((prevQuantities) => ({
        ...prevQuantities,
        [productId]: quantity,
      }))
      return
    }

    if (+inputQuantities <= 0) {
      setValue(`products.${index}.quantity`, 0)
      setProductQuantities((prevQuantities) => ({
        ...prevQuantities,
        [productId]: 0,
      }))
      return
    }

    setValue(`products.${index}.quantity`, +inputQuantities)
    setProductQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: +inputQuantities,
    }))
  }

  const swarpMode = (productId: string, retail: boolean, index: number) => {

    setValue(`products.${index}.retail`, !retail)

    if (retail) {
      setProductQuantities((prevQuantities) => ({
        ...prevQuantities,
        [productId]: 0,
      }))
      setValue(`products.${index}.quantity`, 0)
    } else {
      setValue(`products.${index}.package`, {
        unit: "kg",
        price: 0,
        weight: 0
      })
    }

    setRetail((prevRetail) => ({
      ...prevRetail,
      [productId]: !retail,
    }))
  }

  const handlePackChange = (productId: string, index: number, price: number) => {
    const product = data.find((item) => item?._id! === productId);

    if (product) {
      product.packageOptions.forEach((packOption, i) => {
        if (packOption.price === price) {
          setPackSeleced((prevPackSeleced) => ({
            ...prevPackSeleced,
            [productId]: {
              unit: packOption.unit,
              weight: packOption.weight,
              price: packOption.price
            } as ProductPack
          }))

          setValue(`products.${index}.package`, {
            unit: packOption.unit,
            weight: packOption.weight,
            price: packOption.price
          })
        }
      });
    }
  }

  React.useEffect(() => {
    const handleGetDeliveryFee = async () => {
      let totalWeight = 0
      const transformedArray = data.map((product, index) => {
        let name = product?.productName!;
        let quantity = 1;
        let weight = 0;

        if (retail[product?._id!]) {
          if (selectedUnits[product?._id!] === "gram") {
            weight = productQuantities[product?._id!]
            totalWeight += productQuantities[product?._id!]
          } else {
            weight = convertWeight(productQuantities[product?._id!], selectedUnits[product?._id!], "gram")
            totalWeight += convertWeight(productQuantities[product?._id!], selectedUnits[product?._id!], "gram")
          }
        } else {
          if (packSeleced[product?._id!].unit === "gram") {
            weight = packSeleced[product?._id!].weight
            totalWeight += packSeleced[product?._id!].weight
          } else {
            weight = convertWeight(packSeleced[product?._id!].weight, packSeleced[product?._id!].unit, "gram")
            totalWeight += convertWeight(packSeleced[product?._id!].weight, packSeleced[product?._id!].unit, "gram")
          }
        }

        return {
          name,
          quantity,
          weight,
        }
      })

      if (getValues("delivery")[0] === "Giao hàng nhanh") {
        const res = await getGHNServiceFee({
          shop_id: data[0]?.shopInfo.shop_id.GHN!,
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
      if (data && data.length > 0) {
        handleGetDeliveryFee()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [districtId,
    wardId,
    retail,
    selectedUnits,
    packSeleced,
    productQuantities,
    data,
    isOpenBuyModal
  ])

  const onSubmit = async (data: IOrderZodSchema) => {

    console.log("data", data)
  }

  return (
    <div className="flex flex-col gap-2">
      <Modal
        isOpen={isOpenBuyModal}
        onOpenChange={onOpenChangeBuyModal}
        scrollBehavior="outside"
        size="5xl"
        placement="bottom"
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
                    {
                      data && data.length > 0 && data.map((product, index) => {
                        return (
                          <div className="flex flex-col gap-2" key={product?._id}>
                            <div className="flex flex-row gap-2 mb-2">
                              <Image
                                src={product?.productImages[0]}
                                alt={product?.productName}
                                width={60}
                                height={60}
                                radius="lg"
                                className="object-cover w-14 h-14 rounded-full shadow-sm"
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
                                    isInvalid={!!errors.products?.[index]?.quantity}
                                    errorMessage={errors.products?.[index]?.quantity?.message}
                                    {...register(`products.${index}.quantity`)}
                                    value={productQuantities[product?._id!].toString()}
                                    onChange={(e) => handleQuantityChange(e, product?._id!, productQuantitiesState[product?._id!], index)}
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
                                </>
                              )
                            }
                          </div>
                        )
                      })
                    }
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
                        data && data.length > 0 && data.map((product, index) => {
                          return (
                            <div key={product?._id}>
                              <p>{product?.productName}</p>
                              {
                                retail[product?._id!] ? (
                                  <div className="flex flex-row items-center justify-between">
                                    <span className="font-semibold text-primary">
                                      {
                                        formattedPriceWithUnit(product?.productPrice!, selectedUnits[product?._id!], productQuantities[product?._id!])
                                      }
                                    </span>
                                    <span className="font-medium text-xs opacity-70">{productQuantities[index || 0]}{selectedUnits[product?._id!]}</span>
                                  </div>

                                ) : (
                                  <div className="flex flex-row items-center justify-between">
                                    <span className="font-semibold text-primary">
                                      {
                                        formattedPriceWithUnit(packSeleced[product?._id!].price)
                                      }
                                    </span>
                                    <span className="font-medium text-xs opacity-70">{packSeleced[product?._id!].weight}{packSeleced[product?._id!].unit}</span>
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
                            <span className="font-medium text-xs opacity-70">{data[0]?.shopInfo.address[0].province}</span>
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