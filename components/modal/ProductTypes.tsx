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
import { addProductType, getProductTypes } from "@/actions/products";
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
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
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
                <Button color="danger" variant="flat" onPress={onClose}>
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
      {/* <div className="flex justify-between w-full items-center">
        <FormLabel>Loại sản phẩm:</FormLabel>
        <Dialog>
          <DialogTrigger asChild className="cursor-pointer">
            <AiOutlinePlus className="text-xl" />
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
      </Select> */}
    </>
  );
};

export default ProductTypes;
