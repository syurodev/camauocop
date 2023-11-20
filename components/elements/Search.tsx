"use client"
import { memo, useEffect, useState } from 'react'
import { Button, Card, Chip, Divider, Input, Link, Popover, PopoverContent, PopoverTrigger, Select, SelectItem, Skeleton, User } from '@nextui-org/react'
import { BiSearch, BiLink } from "react-icons/bi"
import { useRouter } from 'next/navigation'
import TippyHeadless from "@tippyjs/react/headless";
import { motion } from 'framer-motion'
import { CiShoppingBasket } from "react-icons/ci";
import { MdOutlineTour } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";

import useDebounce from '@/lib/hooks/useDebounce'
import { DestinationsData, ProductData, ProductTypeData, SearchResponse, ShopData, TourSearchData, search } from '@/actions/features'

type IProps = {
  width: number
}

const Search: React.FC<IProps> = ({ width }) => {
  const router = useRouter()
  const [inputValue, setInputValue] = useState<string>("")
  const [filter, setFilter] = useState<"shopping" | "travel">("shopping")
  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const [searching, setSearching] = useState<boolean>(false)
  const [productTypes, setProductTypes] = useState<ProductTypeData[]>([])
  const [products, setProducts] = useState<ProductData[]>([])
  const [tours, setTours] = useState<TourSearchData[]>([])
  const [destinations, setDestinations] = useState<DestinationsData[]>([])
  const [shops, setShops] = useState<ShopData[]>([])
  const [specialtys, setSpecialtys] = useState<ProductTypeData[]>([])
  const [showSearchBox, setShowSearchBox] = useState<boolean>(false);

  let debounced = useDebounce(inputValue, 500);

  useEffect(() => {
    const fetchApi = async () => {
      setSearching(true);
      const res: SearchResponse = await search(debounced, filter)
      setSearching(false);
      if (res.data) {
        if (filter === 'shopping') {
          if (res.data.productTypes && res.data.productTypes.length > 0) {
            setProductTypes(res.data.productTypes)
          } else {
            setProductTypes([])
          }

          if (res.data.specialtys && res.data.specialtys.length > 0) {
            setSpecialtys(res.data.specialtys)
          } else {
            setSpecialtys([])
          }

          if (res.data.shops && res.data.shops.length > 0) {
            setShops(res.data.shops)
          } else {
            setShops([])
          }

          if (res.data.products && res.data.products.length > 0) {
            setProducts(res.data.products)
          } else {
            setProducts([])
          }
        } else {
          if (res.data.tours && res.data.tours.length > 0) {
            setTours(res.data.tours)
          } else {
            setTours([])
          }

          if (res.data.destinations && res.data.destinations.length > 0) {
            setDestinations(res.data.destinations)
          } else {
            setDestinations([])
          }
        }

      }
    };
    if (inputValue) {
      fetchApi();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced, filter]);

  useEffect(() => {
    if (inputValue) {
      setShowSearchBox(true)
    } else {
      setShowSearchBox(false)
    }

    if (width <= 0) {
      setShowSearchBox(false)
    }
  }, [
    inputValue,
    width
  ])

  return (
    <>
      <TippyHeadless
        interactive
        placement='bottom-start'
        appendTo={() => document.body}
        visible={showSearchBox}
        render={(attrs) => (

          <motion.div
            {...attrs}
            // style={{ width: width }} 
            key="searchBox"
            initial={{ width: width, height: 0, opacity: 0 }}
            animate={{ width: width, height: "auto", opacity: 1 }}
            exit={{ width: width, height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`shadow-sm bg-[#f1f1f2]/70 dark:bg-default/80 backdrop-saturate-200 backdrop-blur-3xl rounded-large`}>
            {
              filter === 'shopping' ? (
                <div className="flex p-3 flex-col gap-3">
                  <div>
                    <p>
                      Đặc sản
                    </p>
                    {
                      searching ? (
                        <Skeleton className="h-[16px] w-full rounded-lg" />
                      ) : (
                        specialtys.length > 0 ? (
                          <div className='flex items-center gap-2 mt-1 w-full overflow-auto'>
                            {
                              specialtys.map(item => {
                                return (
                                  <Link
                                    key={item._id}
                                    isBlock
                                    showAnchorIcon
                                    href={`/products/ocop/${item._id}`}
                                    anchorIcon={<BiLink />}
                                    className='whitespace-nowrap'
                                    color='success'
                                  >
                                    {item.name}
                                  </Link>
                                )
                              })
                            }
                          </div>
                        ) : (
                          <motion.p
                            className='text-tiny'
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                          >
                            Không tìm thấy loại sản phẩm
                          </motion.p>
                        )
                      )
                    }
                  </div>

                  <Divider />

                  <div>
                    <p>
                      Loại sản phẩm
                    </p>
                    {
                      searching ? (
                        <Skeleton className="h-[16px] w-full rounded-lg" />
                      ) : (
                        productTypes.length > 0 ? (
                          <div className='flex items-center gap-2 mt-1'>
                            {
                              productTypes.map(item => {
                                return (
                                  <Link
                                    key={item._id}
                                    isBlock
                                    showAnchorIcon
                                    href={`/products/${encodeURIComponent(item.name)}`}
                                    anchorIcon={<BiLink />}
                                    className='whitespace-nowrap'
                                  >
                                    {item.name}
                                  </Link>
                                )
                              })
                            }
                          </div>
                        ) : (
                          <motion.p
                            className='text-tiny'
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                          >
                            Không tìm thấy loại sản phẩm
                          </motion.p>
                        )
                      )
                    }
                  </div>

                  <Divider />

                  <div>
                    <p>
                      Cửa hàng
                    </p>
                    {
                      searching ? (
                        <Skeleton className="h-[16px] w-full rounded-lg" />
                      ) : (
                        <div>
                          {
                            shops.length > 0 ? (
                              <div className='flex flex-col gap-2 items-start mt-1'>
                                {
                                  shops.map(item => {
                                    return (
                                      <Card
                                        key={item._id}
                                        isPressable
                                        className='p-2 w-full'
                                        onPress={() => {
                                          router.push(`/shop/${item._id}`)
                                          setInputValue("")
                                          setShowSearchBox(false)
                                        }}
                                      >
                                        <User
                                          name={item.name}
                                          description={item.type === 'personal' ? "Cửa hàng cá nhân" : "Cửa hàng doanh nghiệp"}
                                          avatarProps={{
                                            src: `${item.image}`
                                          }}
                                          className='cursor-pointer'
                                        />
                                      </Card>
                                    )
                                  })
                                }
                              </div>
                            ) : (
                              <motion.p
                                className='text-tiny'
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                              >
                                Không tìm thấy cửa hàng
                              </motion.p>
                            )
                          }
                        </div>
                      )
                    }
                  </div>

                  <Divider />

                  <div>
                    <div className='flex flex-row justify-between items-center'>
                      <p>Sản phẩm</p>

                      <Button
                        className='border-none'
                        variant='ghost'
                        size='sm'
                        onPress={() => {
                          router.push(`/products/${encodeURIComponent(inputValue)}`)
                          setShowSearchBox(false)
                        }}
                      >
                        Xem tất cả
                      </Button>
                    </div>
                    {
                      searching ? (
                        <Skeleton className="h-[16px] w-full rounded-lg" />
                      ) : (
                        <div>
                          {
                            products.length > 0 ? (
                              <div className='flex flex-col gap-2 items-start mt-1'>
                                {
                                  products.map((item) => {
                                    return (
                                      <Card
                                        key={item._id}
                                        isPressable
                                        isHoverable
                                        className='p-2 w-full flex flex-row items-start gap-3'
                                        onPress={() => {
                                          router.push(`/products/product/${item._id}`)
                                          setInputValue("")
                                          setShowSearchBox(false)
                                        }}
                                      >
                                        <User
                                          name={item.name}
                                          description={item.shopName}
                                          avatarProps={{
                                            src: `${item.image}`,
                                            radius: "lg"
                                          }}
                                          className='cursor-pointer'
                                        />
                                        {
                                          item.specialty && <Chip color="success" size='sm' variant="flat">Đặc sản</Chip>

                                        }
                                      </Card>
                                    )
                                  })
                                }
                              </div>
                            ) : (
                              <motion.p
                                className='text-tiny'
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                              >
                                Không tìm thấy sản phẩm
                              </motion.p>
                            )
                          }
                        </div>

                      )
                    }
                  </div>
                </div>
              ) : (
                <div className="flex p-3 flex-col gap-3">
                  <div>
                    <p>Điểm đến</p>

                    {
                      searching ? (
                        <Skeleton className="h-[16px] w-full rounded-lg" />
                      ) : (
                        <div>
                          {
                            destinations.length > 0 ? (
                              <div className='flex flex-col gap-2 items-start mt-1'>
                                {
                                  destinations.map((item) => {
                                    return (
                                      <Card
                                        key={item._id}
                                        isPressable
                                        isHoverable
                                        className='p-2 w-full flex flex-row items-start gap-3'
                                        onPress={() => {
                                          router.push(`/products/product/${item._id}`)
                                          setInputValue("")
                                          setShowSearchBox(false)
                                        }}
                                      >
                                        <User
                                          name={item.name}
                                          avatarProps={{
                                            src: `${item.image}`,
                                            radius: "full"
                                          }}
                                          className='cursor-pointer'
                                        />
                                      </Card>
                                    )
                                  })
                                }
                              </div>
                            ) : (
                              <motion.p
                                className='text-tiny'
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                              >
                                Không tìm thấy điểm đến
                              </motion.p>
                            )
                          }
                        </div>

                      )
                    }
                  </div>

                  <Divider />

                  <div>
                    <div className='flex flex-row justify-between items-center'>
                      <p>Tours</p>

                      <Button
                        className='border-none'
                        variant='ghost'
                        size='sm'
                        onPress={() => {
                          router.push(`/tourisms/${encodeURIComponent(inputValue)}`)
                          setShowSearchBox(false)
                        }}
                      >
                        Xem tất cả
                      </Button>
                    </div>
                    {
                      searching ? (
                        <Skeleton className="h-[16px] w-full rounded-lg" />
                      ) : (
                        <div>
                          {
                            tours.length > 0 ? (
                              <div className='flex flex-col gap-2 items-start mt-1'>
                                {
                                  tours.map((item) => {
                                    return (
                                      <Card
                                        key={item._id}
                                        isPressable
                                        isHoverable
                                        className='p-2 w-full flex flex-row items-start gap-3'
                                        onPress={() => {
                                          router.push(`/products/product/${item._id}`)
                                          setInputValue("")
                                          setShowSearchBox(false)
                                        }}
                                      >
                                        <User
                                          name={item.tourName}
                                          avatarProps={{
                                            src: `${item.image}`,
                                            radius: "lg"
                                          }}
                                          className='cursor-pointer'
                                        />
                                      </Card>
                                    )
                                  })
                                }
                              </div>
                            ) : (
                              <motion.p
                                className='text-tiny'
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                              >
                                Không tìm thấy tour
                              </motion.p>
                            )
                          }
                        </div>

                      )
                    }
                  </div>
                </div>
              )
            }
          </motion.div>
        )}
        onClickOutside={() => setShowSearchBox(false)}
      >
        <div className='w-full relative'>
          <Input
            radius="lg"
            classNames={{
              label: "text-black/50 dark:text-white/90",
              input: [
                "bg-transparent",
                "text-black/90 dark:text-white/90",
                "placeholder:text-default-700/50 dark:placeholder:text-white/60",
              ],
              innerWrapper: "bg-transparent",
              inputWrapper: [
                "bg-transparent",
                "bg-default-200/40",
                "dark:bg-default/50",
                "backdrop-blur-xl",
                "backdrop-saturate-200",
                "hover:bg-default-200/70",
                "dark:hover:bg-default/70",
                "group-data-[focused=true]:bg-default-200/50",
                "dark:group-data-[focused=true]:bg-default/60",
                "!cursor-text",
              ],
            }}
            placeholder="Nhập nội dung tìm kiếm..."
            startContent={
              // <SearchIcon className="text-black/50 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
              <BiSearch className="text-xl" />
            }
            endContent={
              <Popover
                placement="bottom"
                backdrop='opaque'
                isOpen={isOpenFilter} onOpenChange={(open) => setIsOpenFilter(open)}
              >
                <PopoverTrigger>
                  <Button
                    size='sm'
                    isIconOnly
                    variant='ghost'
                    radius='full'
                    className='border-none'
                  >
                    {
                      filter === 'shopping' ? (
                        <CiShoppingBasket className="text-lg" />
                      ) : (
                        <MdOutlineTour className="text-lg" />
                      )
                    }
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="flex flex-col gap-2 items-center">
                    <Button
                      size='sm'
                      isIconOnly
                      variant='ghost'
                      radius='full'
                      className='border-none'
                      onPress={() => {
                        setFilter('shopping')
                        setIsOpenFilter(false)
                      }}
                    >
                      <CiShoppingBasket className="text-lg" />
                    </Button>

                    <Button
                      size='sm'
                      isIconOnly
                      variant='ghost'
                      radius='full'
                      className='border-none'
                      onPress={() => {
                        setFilter('travel')
                        setIsOpenFilter(false)
                      }}
                    >
                      <MdOutlineTour className="text-lg" />
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            }
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
          // onFocus={() => setInputFocused(true)}
          // onBlur={() => setInputFocused(false)}
          />
        </div>
      </TippyHeadless>
    </>
  )
}

export default memo(Search)