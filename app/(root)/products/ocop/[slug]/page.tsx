"use client";
import { FC, useEffect, useState } from "react";
import CardItem from "@/components/card/CardItem";
import { Button, Card, CardBody, CardFooter, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Listbox, ListboxItem, Pagination, Skeleton } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { BsThreeDotsVertical } from "react-icons/bs"
import { motion, AnimatePresence } from "framer-motion";
import { CiMenuKebab } from "react-icons/ci"

import { getProductsSpecialty } from "@/actions/products";
import { categories } from '@/lib/constant/CategoriesDefault'
import { getSpecialtys } from "@/actions/specialty";
import toast from "react-hot-toast";

type IProps = {
  params: {
    slug: string;
  };
};

const ProductsOCOPPage: FC<IProps> = ({ params }) => {
  const router = useRouter()
  const slug = decodeURIComponent(params.slug);
  const [data, setData] = useState<IProductsResponse>();
  const [page, setPage] = useState<number>(1);
  const [specialtys, setSpecialtys] = useState<SpecialtysData[]>([]);
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [filter, setFilter] = useState<Filter>({
    price: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const response = await getProductsSpecialty(slug || "all", page, 12, filter);
      setData(response);
      setIsLoading(false)
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.slug, filter]);

  useEffect(() => {
    const fetchApi = async () => {
      const res = await getSpecialtys()
      if (res.code === 200) {
        setSpecialtys(res.data!)
      } else {
        toast.error(res.message)
      }
    }
    fetchApi()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex flex-row items-start gap-3 mt-3">
      <AnimatePresence>
        {
          showFilter && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 350, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="sticky lg:hidden"
            >
              <Listbox
                items={specialtys}
                aria-label="Danh sách đặc sản"
                onAction={(key) => router.push(`/products/ocop/${key}`)}
              >
                {(item) => (
                  <ListboxItem
                    key={item._id}
                  >
                    {item.name}
                  </ListboxItem>
                )}
              </Listbox>
            </motion.div>
          )
        }
      </AnimatePresence>

      <div className="hidden lg:!flex">
        <Listbox
          items={specialtys}
          aria-label="Danh sách đặc sản"
          onAction={(key) => router.push(`/products/ocop/${key}`)}
        >
          {(item) => (
            <ListboxItem
              key={item._id}
            >
              {item.name}
            </ListboxItem>
          )}
        </Listbox>
      </div>

      <motion.div
        className="flex flex-col items-center gap-4 w-full"
        initial={{ width: "100%", height: 0, opacity: 0 }}
        animate={{ width: "100%", height: "auto", opacity: 1 }}
        exit={{ width: "100%", height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* SORT */}
        <div className="w-full flex justify-between lg:!justify-end gap-3">
          <Button
            isIconOnly
            size="sm"
            radius="full"
            className="lg:hidden"
            onPress={() => setShowFilter(!showFilter)}
          >
            <CiMenuKebab className="text-small" />
          </Button>

          <Dropdown>
            <DropdownTrigger>
              <Button
                endContent={<BsThreeDotsVertical className="text-small" />}
                size="sm"
                variant="flat"
              >
                Mức giá
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Price Filter"
              closeOnSelect={false}
              // selectedKeys={priceFilter}
              selectionMode="single"
              // onSelectionChange={setPriceFilter}
              onAction={(key) => {
                setFilter(prev => {
                  return {
                    ...prev,
                    price: key.toString(),
                  }
                })
              }}
            >
              <DropdownItem
                key={"hight"}
              >
                Từ cao tới thấp
              </DropdownItem>
              <DropdownItem
                key={"low"}
              >
                Từ thấp tới cao
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        <AnimatePresence mode="wait">
          <div className="mt-5 w-full grid items-center sm:grid-cols-2 grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4 xl:gap-5">
            {
              isLoading ? (
                Array.from({ length: 15 }).map((_, index) => (
                  <motion.div
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 15, opacity: 0 }}
                    transition={{ duration: 0.3, delay: index / 10 }}
                    key={index}
                  >
                    <Card shadow="sm" >
                      <Skeleton isLoaded={!isLoading} className="rounded-lg">
                        <CardBody className="overflow-visible p-0">
                          <div className="w-full h-[140px]"></div>
                        </CardBody>
                      </Skeleton>

                      <CardFooter className="flex flex-col text-small justify-between">
                        <Skeleton isLoaded={!isLoading} className="rounded-lg">
                          <b className="line-clamp-2">productname</b>
                        </Skeleton>
                        <Skeleton isLoaded={!isLoading} className="rounded-lg mt-2">
                          <p className="text-default-500">productprice</p>
                        </Skeleton>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))
              ) : data && data.products.length > 0 ? data.products.map((product, index) => (
                <motion.div
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 15, opacity: 0 }}
                  transition={{ duration: 0.3, delay: index / 10 }}
                  key={product?._id}
                >
                  <CardItem data={product} />
                </motion.div>
              )) : <span>Không có sản phẩm</span>
            }
          </div>
        </AnimatePresence>

        <Pagination showControls total={data?.totalPages || 1} initialPage={page} onChange={setPage} />
      </motion.div>
    </div>
  );
};

export default ProductsOCOPPage;
