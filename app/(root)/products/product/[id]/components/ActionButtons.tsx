"use client";
import React from "react";
import { Button, Tooltip, useDisclosure } from "@nextui-org/react";
import {
  AiOutlineShoppingCart,
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineDollarCircle,
} from "react-icons/ai";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";

import BuyModal from "@/components/modal/BuyModal";

type IProps = {
  data: string
  user: string
}

const ActionButtons: React.FC<IProps> = ({ user, data }) => {
  const [favorited, setFavorited] = React.useState<boolean>(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const router = useRouter()

  const session: Session = JSON.parse(user)
  const products: (IProductDetail | null)[] = JSON.parse(data)

  const handleFavorited = () => {
    if (!session) {
      router.push("/login")
    }

    setFavorited(!favorited);
  };

  const handleBuyButtomClick = () => {
    if (!session) {
      router.push("/login")
      return
    }
    onOpen()
  }

  const handleAddToCart = () => {
    if (!session) {
      router.push("/login")
    }
  }

  return (
    <div className="flex justify-around items-center mt-3">
      <Tooltip content={`${!session ? "Đăng nhập" : "Thêm vào giỏ hàng"}`}>
        <Button isIconOnly variant="ghost" radius="full" onPress={handleAddToCart}>
          <AiOutlineShoppingCart className="text-xl" />
        </Button>
      </Tooltip>

      <Tooltip
        content={`${!session ? "Đăng nhập" : favorited
          ? "Xoá khỏi danh sách yêu thích"
          : "Thêm vào danh sách yêu thích"}`}
      >
        <Button
          isIconOnly
          variant="ghost"
          radius="full"
          onClick={handleFavorited}
        >
          {favorited ? (
            <AiFillHeart className="text-xl text-rose-600" />
          ) : (
            <AiOutlineHeart className="text-xl" />
          )}
        </Button>
      </Tooltip>

      <Tooltip content={`${!session ? "Đăng nhập" : "Mua ngay"}`}>
        <Button
          variant="flat"
          radius="full"
          className="bg-emerald-500"
          startContent={<AiOutlineDollarCircle className="text-xl" />}
          onPress={handleBuyButtomClick}
        >
          {
            !session ? "Đăng nhập để mua" : "Mua ngay"
          }
        </Button>
      </Tooltip>

      <BuyModal
        isOpenBuyModal={isOpen}
        onOpenChangeBuyModal={onOpenChange}
        onCloseBuyModal={onClose}
        data={products}
      />
    </div>
  );
};

export default ActionButtons;
