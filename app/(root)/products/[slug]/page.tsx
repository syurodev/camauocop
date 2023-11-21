"use client";

import { getProducts, searchProducts } from "@/actions/products";
import { FC, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BsThreeDotsVertical } from "react-icons/bs"
import { CiMenuKebab } from "react-icons/ci"
import { Accordion, AccordionItem, Button, Card, CardBody, CardFooter, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Pagination, Skeleton } from "@nextui-org/react";
import { useRouter } from "next/navigation";

import CardItem from "@/components/card/CardItem";
import { ProductTypesResponse, getProductTypes } from "@/actions/productType";

type IProps = {
  params: {
    slug: string;
  };
};

const ProductsPage: FC<IProps> = ({ params }) => {
  const router = useRouter()
  const slug = decodeURIComponent(params.slug);
  const [data, setData] = useState<IProductsResponse>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [productTypesLoading, setProductTypesLoading] = useState<boolean>(true);
  const [productTypes, setProductTypes] = useState<ProductTypesResponse[]>([]);
  const [page, setPage] = useState<number>(1);
  const [filter, setFilter] = useState<Filter>({
    price: "",
  });

  const [showFilter, setShowFilter] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      if (slug === "news") {
        const res: IProductsResponse = await getProducts(page, 24);
        setData(res)
      } else {
        const response = await searchProducts(slug, page, filter);
        setData(response);
      }
      setIsLoading(false)
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.slug, filter]);

  useEffect(() => {
    const fetchApi = async () => {
      setProductTypesLoading(true)
      const res = await getProductTypes()
      if (res.code === 200) {
        setProductTypes(res.data)
      }
      setProductTypesLoading(false)
    }
    fetchApi()
  }, [])

  return (
    <div className="flex flex-row items-start gap-6 mt-3">
      <AnimatePresence mode="wait">
        {
          showFilter && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 350, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="sticky lg:hidden"
            >
              <div className="w-[350px] flex flex-col gap-4">
                <Button
                  variant="flat"
                  color="success"
                  className="border-none"
                  onPress={() => router.push("/products/ocop/all")}
                >
                  Đặc sản
                </Button>

                <Accordion
                  variant="bordered"
                  isCompact
                  defaultExpandedKeys={["1"]}
                >
                  <AccordionItem key="1" aria-label="Loại sản phẩm" title="Loại sản phẩm">
                    <div className="flex flex-col gap-3">
                      {
                        productTypes.map((productType, index) => {
                          return (
                            <Button
                              key={index}
                              variant="flat"
                              className="border-none"
                              size="sm"
                              onPress={() => router.push(`/products/${encodeURIComponent(productType.typeName)}`)}
                            >
                              {
                                productType.typeName
                              }
                            </Button>
                          )
                        })
                      }
                    </div>
                  </AccordionItem>

                  {/* <AccordionItem key="2" aria-label="Khoản giá" title="Khoản giá">
                    2
                  </AccordionItem> */}

                  {/* <AccordionItem key="3" aria-label="Accordion 3" title="Accordion 3">
        3
      </AccordionItem> */}
                </Accordion>
              </div>
            </motion.div>
          )
        }

        <div className="min-w-[300px] max-w-[350px] hidden lg:!flex lg:!flex-col lg:!gap-4">
          <Button
            variant="flat"
            color="success"
            className="border-none"
            onPress={() => router.push("/products/ocop/all")}
          >
            Đặc sản
          </Button>

          <Accordion
            variant="bordered"
            isCompact
            defaultExpandedKeys={["1"]}
          >
            <AccordionItem key="1" aria-label="Loại sản phẩm" title="Loại sản phẩm">
              <div className="flex flex-col gap-3">
                {
                  productTypes.map((productType, index) => {
                    return (
                      <Button
                        key={index}
                        variant="flat"
                        className="border-none"
                        size="sm"
                        onPress={() => router.push(`/products/${encodeURIComponent(productType.typeName)}`)}
                      >
                        {
                          productType.typeName
                        }
                      </Button>
                    )
                  })
                }
              </div>
            </AccordionItem>

            {/* <AccordionItem key="2" aria-label="Khoản giá" title="Khoản giá">
              2
            </AccordionItem> */}

            {/* <AccordionItem key="3" aria-label="Accordion 3" title="Accordion 3">
        3
      </AccordionItem> */}
          </Accordion>
        </div>

        <motion.div
          className="flex flex-col items-center gap-4 w-full"
          initial={{ width: "100%", height: 0, opacity: 0 }}
          animate={{ width: "100%", height: "auto", opacity: 1 }}
          exit={{ width: "100%", height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-full flex justify-start">
            <h2>{`Kết quả của: ${slug === "all" ? "Đặc sản" : slug}`}</h2>
          </div>
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
      </AnimatePresence>
    </div>
  );
};

export default ProductsPage;
