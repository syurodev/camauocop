"use client";

import * as React from "react";
import { Button, Card, CardBody, CardFooter, Image, useDisclosure, Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { HiSparkles } from "react-icons/hi2"

import { formattedPriceWithUnit } from "@/lib/formattedPriceWithUnit";
import EditProductModal from "@/components/modal/EditProductModal";
import DeleteConfirmModal from "../modal/DeleteConfirmModal";

interface CardItemProps {
  data: IProducts;
  editButton?: boolean
  deleteButton?: boolean
}

const CardItem: React.FC<CardItemProps> = ({
  data,
  editButton = false,
  deleteButton = false
}) => {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { isOpen: isOpenDelete, onOpen: onOpenDelete, onOpenChange: onOpenChangeDelete, onClose: onCloseDelete } = useDisclosure();
  const [isOpenPopover, setIsOpenPopover] = React.useState(false);

  return (
    <>
      {
        editButton || deleteButton ? (
          <Popover
            placement="right"
            showArrow={true}
            backdrop="blur"
            isOpen={isOpenPopover}
            onOpenChange={(open) => setIsOpenPopover(open)}
          >
            <PopoverTrigger>
              <Card
                shadow="sm"
                key={data._id}
                isPressable
                className="w-full"
              >
                <CardBody className="overflow-visible p-0 relative">
                  <Image
                    shadow="sm"
                    radius="lg"
                    isZoomed
                    width="100%"
                    alt={data.productName}
                    className="w-full object-cover h-[140px]"
                    src={data.productImages[0]}
                  />

                  {
                    data.specialty && (
                      <div className="absolute bottom-[-12px] left-1/2 -translate-x-1/2 z-50 shadow-md rounded-full">
                        <HiSparkles className="text-2xl" />
                      </div>
                    )
                  }
                </CardBody>

                <CardFooter className="flex flex-col text-small justify-between">
                  <b className="line-clamp-1">{data.productName}</b>
                  <p
                    className="text-default-500"
                  >
                    {data.productPrice > 0 ? formattedPriceWithUnit(data.productPrice) : "Không có giá bán lẻ"}
                  </p>
                </CardFooter>
              </Card>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <div className="flex !flex-col gap-3 w-[150px]">
                <Button
                  variant="ghost"
                  color="default"
                  radius="lg"
                  className="border-none w-full"
                  onPress={() => {
                    setIsOpenPopover(false)
                    router.push(`/products/product/${data._id}`)
                  }}
                >
                  Truy cập
                </Button>
                {
                  editButton && (
                    <Button
                      variant="ghost"
                      color="default"
                      radius="lg"
                      className="border-none w-full"
                      onPress={() => {
                        setIsOpenPopover(false)
                        onOpen()
                      }}
                    >
                      Chỉnh sửa
                    </Button>
                  )
                }

                {
                  deleteButton && (
                    <Button
                      color="danger"
                      variant="ghost"
                      radius="lg"
                      className="border-none w-full"
                      onPress={() => {
                        setIsOpenPopover(false)
                        onOpenDelete()
                      }}
                    >
                      Xoá
                    </Button>
                  )
                }
              </div>
            </PopoverContent>
          </Popover>
        ) : (
          <Card
            shadow="sm"
            key={data._id}
            isPressable
            className="w-full relative"
            onPress={() => router.push(`/products/product/${data._id}`)}
          >
            <CardBody className="overflow-visible p-0 relative">
              <Image
                shadow="sm"
                radius="lg"
                isZoomed
                width="100%"
                alt={data.productName}
                className="w-full object-cover h-[140px]"
                src={data.productImages[0]}
              />

              {
                data.specialty && (
                  <div className="absolute bottom-[-12px] left-1/2 -translate-x-1/2 z-50 shadow-md rounded-full">
                    <HiSparkles className="text-2xl" />
                  </div>
                )
              }
            </CardBody>

            <CardFooter className="flex flex-col text-small justify-between">
              <b className="line-clamp-1">{data.productName}</b>
              <p
                className="text-default-500"
              >
                {data.productPrice > 0 ? formattedPriceWithUnit(data.productPrice) : "Không có giá bán lẻ"}
              </p>
            </CardFooter>
          </Card>
        )
      }
      {
        isOpen && (
          <EditProductModal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            onClose={onClose}
            productId={data._id}
          />
        )
      }
      {
        isOpenDelete && (
          <DeleteConfirmModal
            isOpen={isOpenDelete}
            onClose={onCloseDelete}
            onOpenChange={onOpenChangeDelete}
            label={"Xác nhận xoá sản phẩm"}
            future={"delete product"}
            content={`Bạn có chắc muốn xoá sản phẩm ${data.productName}`}
            id={data._id}
          />
        )
      }
    </>
  );
};

export default CardItem;
