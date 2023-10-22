"use client";

import React from "react";
import { TbInfoCircle } from "react-icons/tb"
import { Popover, PopoverTrigger, PopoverContent, Button, Spinner } from "@nextui-org/react";

import AddProductForm from "@/components/form/AddProductForm";
import { getShopFee } from "@/actions/shop";
import { useAppSelector } from "@/redux/store";
import { Session } from "next-auth";

const AddProductWrapper: React.FC = () => {
  const [fee, setFee] = React.useState<number>(0)
  const [feeLoading, setFeeLoading] = React.useState<boolean>(true)

  const session: Session | null = useAppSelector((state) => state.sessionReducer.value)

  React.useEffect(() => {
    const fetchShopFee = async () => {
      const res = await getShopFee(session?.user.shopId!)
      setFeeLoading(false)

      if (res.code === 200) {
        setFee(res?.data!)
      }
    }
    fetchShopFee()
  }, [session])

  return (
    <>
      <div className="flex flex-row gap-2 items-center">
        <h1
          className="my-3 text-3xl font-bold"
        >
          THÊM SẢN PHẨM
        </h1>

        <Popover placement="bottom">
          <PopoverTrigger>
            <Button variant="ghost" isIconOnly isDisabled={feeLoading} className="border-none">
              {
                feeLoading ? (
                  <Spinner size="sm" />
                ) : (
                  <TbInfoCircle className="text-xl" />
                )
              }
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="px-1 py-2">
              <p className="text-small pointer-events-none select-none">
                Chúng tôi sẻ thu
                <span className="ms-1 font-bold text-primary">
                  {`${fee > 0 ? `${fee}%` : "một phần trăm nhỏ"}`} giá trị trên mỗi đơn hàng thành công của bạn
                </span>
              </p>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <AddProductForm session={session} />
    </>
  );
};

export default AddProductWrapper;
