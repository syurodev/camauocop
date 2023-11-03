"use client";
import React from "react";
import { Avatar, Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Popover, PopoverContent, PopoverTrigger, Tooltip, useDisclosure } from "@nextui-org/react";
import {
  AiOutlineShoppingCart,
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineDollarCircle,
} from "react-icons/ai";
import { BsFillCartCheckFill } from "react-icons/bs";
import { BiMessageSquareDots } from "react-icons/bi";
import { MdOutlineLocationOn } from "react-icons/md"
import { Session } from "next-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from 'framer-motion'

import BuyModal from "@/components/modal/BuyModal";
import { updatePhone } from "@/actions/user";
import toast from "react-hot-toast";
import { addToCard, setFavorite } from "@/actions/products";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { pushCartItem } from "@/redux/features/cart-slice";
import { setProductsDetail } from "@/redux/features/products-slice";
import Comment from "./Comment";


type IProps = {
  data: string
}

const ActionButtons: React.FC<IProps> = ({ data }) => {
  const dispatch = useDispatch<AppDispatch>()
  const session = useAppSelector(state => state.sessionReducer.value)
  const [products, setProducts] = React.useState<Partial<IProductDetail> | null>(JSON.parse(data) || null)

  const [favorited, setFavorited] = React.useState<boolean>(products?.isFavorite || false);
  const [favoriteLoading, setFavoriteLoading] = React.useState<boolean>(false);
  const [openCommemt, setOpenCommemt] = React.useState<boolean>(false);
  const [addToCartLoading, setAddToCartLoading] = React.useState<boolean>(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { isOpen: isOpenPhoneChange, onOpen: onOpenPhoneChange, onOpenChange: onOpenChangePhone, onClose: onClosePhoneChange } = useDisclosure();
  const router = useRouter()

  React.useEffect(() => {
    if (products) {
      dispatch(setProductsDetail(Array(products as IProductDetail)))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products])

  const handleFavorited = async () => {
    if (!session) {
      router.push("/login")
    }
    setFavoriteLoading(true)
    const res = await setFavorite(session?.user._id!, products?._id!, session?.user.accessToken!)
    setFavoriteLoading(false)

    if (res.code === 200) {
      const updatedProducts = { ...products };
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
    const res = await addToCard(products?._id!, session?.user?._id!, session?.user?.accessToken!)
    setAddToCartLoading(false)

    if (res.code === 200) {
      toast.success(res.message)
      dispatch(pushCartItem({
        productId: products?._id!,
        addedDate: new Date().toISOString()
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
    const res = await updatePhone(data.phone, session?.user?._id!, session?.user?.accessToken!)

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
  const isProductInCart = cartItems && cartItems.length > 0 && cartItems.some(item => item.productId === products?._id)

  return (
    <>
      <div className="flex lg:!hidden justify-center gap-7 items-center mt-3">
        <Tooltip content={`${!session ? "Đăng nhập" : session.user.shopId === products?.shopId ? "Đây là sản phẩm của bạn" : "Thêm vào giỏ hàng"}`}>
          <Button
            isIconOnly
            isDisabled={addToCartLoading || session?.user.shopId === products?.shopId || products?.shopInfo?.status === "block" || session?.user.role === "partner" || session?.user.role === "admin"}
            variant="flat"
            color={isProductInCart ? "success" : "default"}
            radius="full"
            onPress={handleAddToCart}
          >
            {
              isProductInCart ? (
                <BsFillCartCheckFill className="text-xl" />
              ) : (
                <AiOutlineShoppingCart className="text-xl" />
              )
            }
          </Button>
        </Tooltip>

        <Tooltip
          content={`${!session ? "Đăng nhập" : session?.user.shopId === products?.shopId ? "Đây là sản phẩm của bạn" : favorited
            ? "Xoá khỏi danh sách yêu thích"
            : "Thêm vào danh sách yêu thích"}`}
        >
          <Button
            isIconOnly
            variant="flat"
            color={favorited ? "danger" : "default"}
            radius="full"
            isDisabled={favoriteLoading || session?.user.shopId === products?.shopId || session?.user.role === "partner" || session?.user.role === "admin"}
            onClick={handleFavorited}
          >
            {favorited ? (
              <AiFillHeart className="text-xl text-rose-600" />
            ) : (
              <AiOutlineHeart className="text-xl" />
            )}
          </Button>
        </Tooltip>

        <Tooltip content={`${!session ? "Đăng nhập" : session?.user.shopId === products?.shopId ? "Đây là sản phẩm của bạn" : "Mua ngay"}`}>
          <Button
            variant="solid"
            radius="full"
            color="success"
            isDisabled={session?.user.shopId === products?.shopId || products?.shopInfo?.status === "block" || session?.user.role === "partner" || session?.user.role === "admin"}
            startContent={<AiOutlineDollarCircle className="text-xl" />}
            onPress={handleBuyButtomClick}
          >
            {
              !session ? "Đăng nhập để mua" : session?.user.shopId === products?.shopId ? "Đây là sản phẩm của bạn" : "Mua ngay"
            }
          </Button>
        </Tooltip>
      </div>

      <div className="sticky z-10 top-32 right-5 hidden lg:!block">
        {
          openCommemt ? (
            <AnimatePresence
              mode="wait"
            >
              <motion.div
                key="comment"
                initial={{ width: 0, height: "100%", opacity: 0 }}
                animate={{ width: "auto", height: "100%", opacity: 1 }}
                exit={{ width: 0, height: "100%", opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className='w-full lg:!w-[350px] lg:min-h-[calc(100vh-70px)] lg:border-s-1 p-2 -mt-14 relative'
                >
                  <Comment openCommemt={openCommemt} setOpenCommemt={setOpenCommemt} productId={products?._id!} />
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <AnimatePresence
              mode="wait"
            >
              <motion.div
                key="actionButton"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="hidden lg:!flex flex-col gap-3 w-fit"
              >
                <Popover showArrow placement="left">
                  <PopoverTrigger>
                    <Avatar as={"button"} src={products?.shopInfo?.image} />
                  </PopoverTrigger>
                  <PopoverContent className="flex flex-col justify-start items-start p-3">
                    <p>
                      <span className="font-semibold text-lg">
                        {
                          products?.shopInfo?.name
                        }
                      </span>

                      <span
                        className="ps-2"
                      >
                        {
                          products?.shopInfo?.phone
                        }
                      </span>

                    </p>
                    <p className="flex flex-row gap-1 items-center">
                      <MdOutlineLocationOn />
                      {
                        `${products?.shopInfo?.address[0].apartment} - ${products?.shopInfo?.address[0].ward} - ${products?.shopInfo?.address[0].district}`
                      }
                    </p>

                    <Button
                      size="sm"
                      className="border-none mt-2"
                      color="success"
                      onPress={() => router.push(`/shop/${products?.shopId}`)}
                    >
                      Truy cập
                    </Button>
                  </PopoverContent>
                </Popover>

                <Tooltip
                  content={`${!session ? "Đăng nhập" : session.user.shopId === products?.shopId ? "Đây là sản phẩm của bạn" : "Thêm vào giỏ hàng"}`}
                  placement="left"
                >
                  <Button
                    isIconOnly
                    isDisabled={addToCartLoading || session?.user.shopId === products?.shopId || products?.shopInfo?.status === "block" || session?.user.role === "partner" || session?.user.role === "admin"}
                    variant="flat"
                    color={isProductInCart ? "success" : "default"}
                    radius="full"
                    onPress={handleAddToCart}
                  >
                    {
                      isProductInCart ? (
                        <BsFillCartCheckFill className="text-xl" />
                      ) : (
                        <AiOutlineShoppingCart className="text-xl" />
                      )
                    }
                  </Button>
                </Tooltip>

                <Tooltip
                  content={`${!session ? "Đăng nhập" : session?.user.shopId === products?.shopId ? "Đây là sản phẩm của bạn" : favorited
                    ? "Xoá khỏi danh sách yêu thích"
                    : "Thêm vào danh sách yêu thích"}`}
                  placement="left"
                >
                  <Button
                    isIconOnly
                    variant="flat"
                    color={favorited ? "danger" : "default"}
                    radius="full"
                    isDisabled={favoriteLoading || session?.user.shopId === products?.shopId || session?.user.role === "partner" || session?.user.role === "admin"}
                    onClick={handleFavorited}
                  >
                    {favorited ? (
                      <AiFillHeart className="text-xl text-rose-600" />
                    ) : (
                      <AiOutlineHeart className="text-xl" />
                    )}
                  </Button>
                </Tooltip>

                <Tooltip
                  content={`${!session ? "Đăng nhập" : session?.user.shopId === products?.shopId ? "Đây là sản phẩm của bạn" : "Mua ngay"}`}
                  placement="left"
                >
                  <Button
                    variant="solid"
                    radius="full"
                    color="success"
                    isIconOnly
                    isDisabled={session?.user.shopId === products?.shopId || products?.shopInfo?.status === "block" || session?.user.role === "partner" || session?.user.role === "admin"}
                    onPress={handleBuyButtomClick}
                  >
                    <AiOutlineDollarCircle className="text-xl" />
                  </Button>
                </Tooltip>

                <Tooltip
                  content={`${!session ? "Đăng nhập" : "Bình luận"}`}
                  placement="left"
                >
                  <Button
                    isIconOnly
                    variant="flat"
                    radius="full"
                    onPress={() => setOpenCommemt(true)}
                  >
                    <BiMessageSquareDots className="text-xl" />
                  </Button>
                </Tooltip>
              </motion.div>
            </AnimatePresence>
          )
        }
      </div>

      {
        session && (
          <BuyModal
            isOpenBuyModal={isOpen}
            onOpenChangeBuyModal={onOpenChange}
            onCloseBuyModal={onClose}
            session={session}
          />
        )
      }

      <Modal
        isOpen={isOpenPhoneChange}
        onOpenChange={onOpenChangePhone}
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

export default React.memo(ActionButtons);
