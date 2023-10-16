"use client"

import React from 'react'
import { useDispatch } from 'react-redux'
import { Button, CheckboxGroup, useDisclosure } from '@nextui-org/react'
import {
  AiOutlineDollarCircle,
} from "react-icons/ai";

import { AppDispatch, useAppSelector } from '@/redux/store'
import { setProductsDetail } from '@/redux/features/products-slice'
import CustomCheckbox from './CustomCheckbox'
import BuyModal from '@/components/modal/BuyModal';
import { deleteCartItems } from '@/actions/cart';
import toast from 'react-hot-toast';

type IProps = {
  data: string
}

const CartView: React.FC<IProps> = ({ data }) => {
  const [groupSelected, setGroupSelected] = React.useState<string[]>([]);
  const [productsData, setProductsData] = React.useState<IProductDetail | IProductDetail[] | null>(JSON.parse(data));
  const [shopSelected, setShopSelected] = React.useState<string>("");
  const dispatch = useDispatch<AppDispatch>()
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const session = useAppSelector((state) => state.sessionReducer.value)


  const handleSelectProduct = (e: string[] | React.FormEvent<HTMLDivElement>) => {
    setGroupSelected(e as string[])
    const selected: string[] = e as string[]

    if (productsData && Array.isArray(productsData)) {
      const selectedProducts = productsData.filter(item => selected.includes(item._id));

      setShopSelected(selectedProducts[0] ? selectedProducts[0]?.shopId : "")
      dispatch(setProductsDetail(selectedProducts));
    }
  }

  const handleDeleteProduct = async () => {
    const res = await deleteCartItems(session?.user._id!, session?.user.accessToken!, groupSelected)

    if (res.code === 200) {
      if (productsData && Array.isArray(productsData)) {
        const updatedProducts = productsData.filter((item) => !groupSelected.includes(item._id));

        setProductsData(updatedProducts)
        setGroupSelected([])
        setShopSelected("")
      }
      toast.success(res.message)
    } else {
      toast.error(res.message)
    }
  }

  return (
    productsData && Array.isArray(productsData) && productsData.length > 0 ? (
      <>
        <div className="flex flex-col lg:flex-row gap-1 w-full">
          <CheckboxGroup
            label="Chọn sản phẩm"
            value={groupSelected}
            onChange={(e) => handleSelectProduct(e)}
            classNames={{
              base: "w-full"
            }}
          >
            {
              productsData.map(item => {
                return (
                  <CustomCheckbox
                    value={item._id}
                    key={item._id}
                    product={{
                      name: `${item.productName}`,
                      image: `${item.productImages[0]}`,
                      username: `${item.shopInfo.name}`,
                      shopurl: `/shop/${item.shopId}`,
                      producturl: `/products/product/${item._id}`,
                      role: "Tình trạng",
                      status: `${item.productQuantity > 0 ? "Còn hàng" : "Hết hàng"}`,
                    }}
                    statusColor={item.productQuantity > 0 ? "success" : "default"}
                    disable={shopSelected !== "" && shopSelected !== item?.shopId}
                  />
                )
              })
            }

          </CheckboxGroup>
        </div>

        {
          groupSelected.length > 0 ? (
            <div className='absolute bottom-3 right-3 flex flex-row gap-3 items-center'>
              <Button
                variant="bordered"
                radius="full"
                color="default"
                onPress={handleDeleteProduct}
              >
                Xoá khỏi giỏ hàng
              </Button>

              <Button
                variant="solid"
                radius="full"
                color="success"
                startContent={<AiOutlineDollarCircle className="text-xl" />}
                onPress={onOpen}
              >
                Mua ngay
              </Button>
            </div>
          ) : (
            <></>
          )
        }

        <BuyModal
          isOpenBuyModal={isOpen}
          onCloseBuyModal={onClose}
          onOpenChangeBuyModal={onOpenChange}
          session={session!}
        />
      </>
    ) : (
      <></>
    )
  )
}

export default CartView