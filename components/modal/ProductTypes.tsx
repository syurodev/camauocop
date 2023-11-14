"use client";
import React from "react";
import toast from "react-hot-toast";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import { addProductType } from "@/actions/products";
import { AiOutlinePlus } from "react-icons/ai";

type IProductTypeModel = {
  id: string | undefined;
  setProductTypes: React.Dispatch<React.SetStateAction<IAddProductTypes[]>>;
  productTypes: IAddProductTypes[];
};

const ProductTypes: React.FC<IProductTypeModel> = ({
  id,
  productTypes,
  setProductTypes,
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [newProductTypes, setNewProductTypes] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");

  const onSubmit = async () => {
    if (newProductTypes.trim() === "") {
      setError("Vui lòng nhập tên loại hàng hoá");
      return;
    }
    const res = await addProductType({
      name: newProductTypes,
      shopId: id,
    });

    if (res.satus && res.newProductType) {
      toast.success(res.message);
      setNewProductTypes("");
      setProductTypes([...productTypes, res.newProductType]);
    } else {
      setError(res.message);
    }
  };

  return (
    <>
      {/* <div className="flex items-center justify-between"> */}
      {/* <p>Loại sản phẩm:</p> */}
      <Button
        onPress={onOpen}
        isIconOnly
        radius="full"
        variant="ghost"
        className="border-none"
      >
        <AiOutlinePlus className="text-xl" />
      </Button>
      {/* </div> */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Thêm loại sản phẩm
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label="Tên loại sản phẩm"
                  placeholder="Nhập tên loại sản phẩm"
                  variant="bordered"
                  value={newProductTypes}
                  onChange={(e) => {
                    setError("");
                    setNewProductTypes(e.target.value);
                  }}
                  isInvalid={!!error}
                  errorMessage={error && error}
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="bordered" onPress={onClose}>
                  Đóng
                </Button>
                <Button color="primary" type="submit" onPress={onSubmit}>
                  Tạo
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProductTypes;
