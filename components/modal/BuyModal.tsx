"use client"
import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, Select, SelectItem, Card, CardHeader, CardBody, Image, Input, Button, Divider, useDisclosure } from "@nextui-org/react";
import { LuMinus, LuPlus } from "react-icons/lu"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IOrderZodSchema, OrderZodSchema } from "@/lib/zodSchema/order";

import { formattedPriceWithUnit } from "@/lib/formattedPriceWithUnit";
import DeliveryCard from "../card/DeliveryCard";
import CurrentLocation from "./CurrentLocation";

type IProps = {
  isOpenBuyModal: boolean;
  onCloseBuyModal?: () => void;
  onOpenChangeBuyModal: () => void;
  data: (IProductDetail | null)[]
}

const BuyModal: React.FC<IProps> = ({ isOpenBuyModal, onCloseBuyModal, onOpenChangeBuyModal, data }) => {
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

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const [productQuantities, setProductQuantities] = React.useState<number[]>([]);

  React.useEffect(() => {
    const newQuantities = data.map(() => 0);
    setProductQuantities(newQuantities);
  }, [data]);

  const handleMinus = (index?: number) => {
    const currentValue = getValues(`products.${index || 0}.quantity`)

    if (+currentValue === 0) {
      return
    }
    setValue(`products.${index || 0}.quantity`, +currentValue - 1)
    const newQuantities = [...productQuantities];
    newQuantities[index || 0] = +currentValue - 1;
    setProductQuantities(newQuantities);
  }

  const handlePlus = (index?: number, quantity?: number) => {
    const currentValue = getValues(`products.${index || 0}.quantity`)

    if (quantity && currentValue >= quantity) {
      return
    }
    setValue(`products.${index || 0}.quantity`, +currentValue + 1)
    const newQuantities = [...productQuantities];
    newQuantities[index || 0] = +currentValue + 1;
    setProductQuantities(newQuantities);
  }

  const handleQuantityChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    quantity: number
  ) => {
    const currentQuantities = e.target.value
    const newQuantities = [...productQuantities];

    if (+currentQuantities >= quantity) {
      setValue(`products.${index || 0}.quantity`, quantity)
      newQuantities[index || 0] = quantity;
      setProductQuantities(newQuantities);
      return
    }

    if (+currentQuantities <= 0) {
      setValue(`products.${index || 0}.quantity`, 0)
      newQuantities[index || 0] = 0;
      setProductQuantities(newQuantities);
      return
    }

    setValue(`products.${index || 0}.quantity`, +currentQuantities)
    newQuantities[index || 0] = +currentQuantities;
    setProductQuantities(newQuantities);
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
            <form>
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
                            <div className="flex flex-row gap-2 items-center">
                              <Image
                                src={product?.productImages[0]}
                                alt={product?.productName}
                                width={60}
                                height={60}
                                radius="lg"
                              />
                              <div>
                                <h4 className="font-medium">{product?.productName}</h4>
                                <h4 className="text-primary">{formattedPriceWithUnit(product?.productPrice)}</h4>
                              </div>
                            </div>
                            <Input
                              type="number"
                              label="Số lượng"
                              placeholder="0"
                              labelPlacement="outside"
                              max={product?.productQuantity}
                              isInvalid={!!errors.products?.[index]?.quantity}
                              errorMessage={errors.products?.[index]?.quantity?.message}
                              min={0}
                              {...register(`products.${index || 0}.quantity`)}
                              startContent={
                                <Button isIconOnly variant="ghost" radius="full" className="border-none" onPress={() => handleMinus(index)}>
                                  <LuMinus className="text-xl" />
                                </Button>
                              }
                              endContent={
                                <Button
                                  isIconOnly
                                  variant="ghost"
                                  radius="full"
                                  className="border-none"
                                  onPress={() => handlePlus(index, product?.productQuantity!)}>
                                  <LuPlus className="text-xl" />
                                </Button>
                              }
                              value={productQuantities[index || 0].toString()}
                              onChange={(e) => handleQuantityChange(e, index, product?.productQuantity!)}
                            />
                          </div>
                        )
                      })
                    }
                  </CardBody>
                </Card>

                <div className="flex-1 flex gap-3 flex-col">
                  <DeliveryCard />
                  <Card shadow="sm">
                    <CardHeader>
                      Tổng tiền
                    </CardHeader>
                    <Divider />
                    <CardBody>
                      {
                        data && data.length > 0 && data.map((product, index) => {
                          return (
                            <React.Fragment key={product?._id}>
                              <p>{product?.productName}</p>
                              <p>
                                {
                                  formattedPriceWithUnit(product?.productPrice! * productQuantities[index || 0])
                                }
                              </p>
                            </React.Fragment>
                          )
                        })
                      }
                    </CardBody>
                  </Card>
                </div>
              </ModalBody>
            </form>
          )}
        </ModalContent>
      </Modal>

      <CurrentLocation
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={onClose}
      />
    </div>
  );
}

export default React.memo(BuyModal)