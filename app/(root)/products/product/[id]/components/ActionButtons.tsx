"use client";
import React from "react";
import { Button, Tooltip } from "@nextui-org/react";
import {
  AiOutlineShoppingCart,
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineDollarCircle,
} from "react-icons/ai";

const ActionButtons: React.FC = () => {
  const [favorited, setFavorited] = React.useState<boolean>(false);

  const handleFavorited = () => {
    setFavorited(!favorited);
  };

  return (
    <div className="flex justify-around items-center mt-3">
      <Tooltip content="Thêm vào giỏ hàng">
        <Button isIconOnly variant="ghost" radius="full">
          <AiOutlineShoppingCart className="text-xl" />
        </Button>
      </Tooltip>

      <Tooltip
        content={
          favorited
            ? "Xoá khỏi danh sách yêu thích"
            : "Thêm vào danh sách yêu thích"
        }
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

      <Tooltip content="Mua ngay">
        <Button
          variant="flat"
          radius="full"
          className="bg-emerald-500"
          startContent={<AiOutlineDollarCircle className="text-xl" />}
        >
          Mua ngay
        </Button>
      </Tooltip>
    </div>
  );
};

export default ActionButtons;
