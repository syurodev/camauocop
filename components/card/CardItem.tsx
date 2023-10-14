"use client";

import * as React from "react";
import { Button, Card, CardBody, CardFooter, Image, useDisclosure } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { FiEdit3 } from "react-icons/fi"
import { MdOutlineDelete } from "react-icons/md"

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

  return (
    <>
      <Card
        shadow="sm"
        key={data._id}
        isPressable
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
            editButton && (
              <Button
                isIconOnly
                size="sm"
                color="default"
                radius="lg"
                className="shadow-sm border-none absolute bottom-2 right-2 z-20"
                onPress={() => onOpen()}
              >
                <FiEdit3 className="text-lg" />
              </Button>
            )
          }

          {
            deleteButton && (
              <Button
                isIconOnly
                size="sm"
                color="danger"
                radius="lg"
                className="shadow-sm border-none absolute bottom-2 left-2 z-20"
                onPress={() => onOpenDelete()}
              >
                <MdOutlineDelete className="text-lg" />
              </Button>
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

      <EditProductModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={onClose}
        productId={data._id}
      />

      <DeleteConfirmModal
        isOpen={isOpenDelete}
        onClose={onCloseDelete}
        onOpenChange={onOpenChangeDelete}
        label={"Xác nhận xoá sản phẩm"}
        future={"delete product"}
        content={`Bạn có chắc muốn xoá sản phẩm ${data.productName}`}
        id={data._id}
      />
    </>
  );
};

export default CardItem;
