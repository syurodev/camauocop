"use client";
import React from "react";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tooltip, useDisclosure } from "@nextui-org/react";
import {
  AiOutlineShoppingCart,
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineDollarCircle,
} from "react-icons/ai";
import {
  BsFillCartCheckFill
} from "react-icons/bs";
import { Session } from "next-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import BuyModal from "@/components/modal/BuyModal";
import { updatePhone } from "@/actions/user";
import toast from "react-hot-toast";
import { addToCard, setFavorite } from "@/actions/products";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { pushCartItem } from "@/redux/features/cart-slice";


type IProps = {
  data: string
  user: string
}

const ActionButtons: React.FC<IProps> = ({ user, data }) => {
  const session: Session = JSON.parse(user)
  const dispatch = useDispatch<AppDispatch>()

  const [products, setProducts] = React.useState<IProductDetail | null>(JSON.parse(data) || null)
  // let products: (IProductDetail | null)[] = JSON.parse(data)

  const [favorited, setFavorited] = React.useState<boolean>(products?.isFavorite || false);
  const [favoriteLoading, setFavoriteLoading] = React.useState<boolean>(false);
  const [addToCartLoading, setAddToCartLoading] = React.useState<boolean>(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { isOpen: isOpenPhoneChange, onOpen: onOpenPhoneChange, onOpenChange: onOpenChangePhone, onClose: onClosePhoneChange } = useDisclosure();
  const router = useRouter()

  const handleFavorited = async () => {
    if (!session) {
      router.push("/login")
    }
    setFavoriteLoading(true)
    const res = await setFavorite(session.user._id, products?._id!, session.user.accessToken)
    setFavoriteLoading(false)

    if (res.code === 200) {
      const updatedProducts = products;
      if (updatedProducts) {
        const updatedProduct = updatedProducts;
        updatedProduct.isFavorite = !favorited;
        setProducts(updatedProducts);
        setFavorited(!favorited);
      }
    } else {
      toast.error(res.message)
    }
  };

  const handleBuyButtomClick = () => {
    if (!session) {
      router.push("/login")
      return
    }
    if (!session.user.phone) {
      onOpenPhoneChange()
      return
    }
    onOpen()
  }

  const handleAddToCart = async () => {
    if (!session) {
      router.push("/login")
    }
    setAddToCartLoading(true)
    const res = await addToCard(products?._id!, session.user._id, session.user.accessToken)
    setAddToCartLoading(false)

    if (res.code === 200) {
      toast.success(res.message)
      dispatch(pushCartItem({
        productId: products?._id!,
        addedDate: new Date
      }))
    } else if (res.code === 202) {
      toast.success(res.message)
    } else {
      toast.error(res.message)
    }
  }

  const PhoneSchema = z.object({
    phone: z
      .string()
      .refine((value) => /^0\d{9}$/.test(value), {
        message: "Số điện thoại không hợp lệ. Phải có 10 số và bắt đầu bằng số 0",
      })
      .refine((value) => value.trim() !== "", {
        message: "Số điện thoại là bắt buộc",
      }),
  })

  type IPhoneSchema = z.infer<typeof PhoneSchema>

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IPhoneSchema>({
    resolver: zodResolver(PhoneSchema),
  })

  const onSubmit = async (data: IPhoneSchema) => {
    console.log(data)
    const res = await updatePhone(data.phone, session.user._id, session.user.accessToken)

    if (res.code === 200) {
      toast.success(`${res.message}. "Trang web sẽ tự động tải lại"`)
      setTimeout(() => {
        window.location.reload()
      }, 2000)
      return
    } else {
      toast.error(res.message)
    }
  }

  const cartItems = useAppSelector((state) => state.cartReducer.value)
  const isProductInCart = cartItems && cartItems.length > 0 && cartItems.map(item => item.productId === products?._id)

  console.log("isProductInCart", isProductInCart)

  return (
    <>
      <div className="flex justify-center gap-7 items-center mt-3">
        <Tooltip content={`${!session ? "Đăng nhập" : "Thêm vào giỏ hàng"}`}>
          <Button
            isIconOnly
            isDisabled={addToCartLoading}
            variant="flat"
            color={isProductInCart && isProductInCart[0] ? "success" : "default"}
            radius="full"
            onPress={handleAddToCart}
          >
            {
              isProductInCart && isProductInCart[0] ? (
                <BsFillCartCheckFill className="text-xl" />
              ) : (
                <AiOutlineShoppingCart className="text-xl" />
              )
            }
          </Button>
        </Tooltip>

        <Tooltip
          content={`${!session ? "Đăng nhập" : favorited
            ? "Xoá khỏi danh sách yêu thích"
            : "Thêm vào danh sách yêu thích"}`}
        >
          <Button
            isIconOnly
            variant="flat"
            color={favorited ? "danger" : "default"}
            radius="full"
            isDisabled={favoriteLoading}
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
            variant="solid"
            radius="full"
            color="success"
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
          session={session}
        />
      </div>

      <Modal
        isOpen={isOpenPhoneChange}
        onOpenChange={onOpenChangePhone}
        isDismissable={false}
        placement="center"
        backdrop="blur"
      >
        <ModalContent>
          {(onClosePhoneChange) => (
            <>
              <form onSubmit={handleSubmit(onSubmit)}>
                <ModalHeader className="flex flex-col gap-1">
                  Thêm số điện thoại
                </ModalHeader>
                <ModalBody>
                  <Input
                    isRequired
                    label="Số điện thoại"
                    description="Bạn phải thêm số điện thoại để có thể đặt hàng"
                    placeholder="0xxxxxxxxxx"
                    type="text"
                    {...register("phone")}
                    isInvalid={!!errors.phone}
                    errorMessage={errors.phone?.message}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="bordered" onPress={onClosePhoneChange}>
                    Huỷ
                  </Button>
                  <Button color="primary" type="submit">
                    Thêm
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ActionButtons;
