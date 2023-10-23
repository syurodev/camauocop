"use client"
import { memo, useEffect, useRef, useState } from 'react'
import { Button, Card, CardBody, Divider, Image, Input, Link, Skeleton, User } from '@nextui-org/react'
import { BiSearch, BiLink } from "react-icons/bi"
import { redirect, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import TippyHeadless from "@tippyjs/react/headless";

import useDebounce from '@/lib/hooks/useDebounce'
import { ProductData, ProductTypeData, SearchResponse, ShopData, search } from '@/actions/features'

type IProps = {
  width: number
}

const Search: React.FC<IProps> = ({ width }) => {
  const router = useRouter()
  const [inputValue, setInputValue] = useState<string>("")
  const [searching, setSearching] = useState<boolean>(false)
  const [productTypes, setProductTypes] = useState<ProductTypeData[]>([])
  const [products, setProducts] = useState<ProductData[]>([])
  const [shops, setShops] = useState<ShopData[]>([])
  const [showSearchBox, setShowSearchBox] = useState<boolean>(false);

  let debounced = useDebounce(inputValue, 500);

  useEffect(() => {
    const fetchApi = async () => {
      setSearching(true);
      const res: SearchResponse = await search(debounced)
      setSearching(false);
      if (res.data) {
        if (res.data.productTypes.length > 0) {
          setProductTypes(res.data.productTypes)
        } else {
          setProductTypes([])
        }

        if (res.data.shops.length > 0) {
          setShops(res.data.shops)
        } else {
          setShops([])
        }

        if (res.data.products.length > 0) {
          setProducts(res.data.products)
        } else {
          setProducts([])
        }
      }
    };
    fetchApi();
  }, [debounced]);

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
          <div {...attrs} style={{ width: width }} className={`shadow-sm bg-default/70 dark:bg-default/80 backdrop-saturate-200 backdrop-blur-3xl rounded-large transition-all duration-250`}>
            <div className="flex p-3 flex-col gap-3">
              <div>
                <p>
                  Loại sản phẩm
                </p>
                {
                  searching ? (
                    <Skeleton className="h-7 w-full rounded-lg" />
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
                    <Skeleton className="h-14 w-full rounded-lg" />
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

                  <Button className='border-none' size='sm'>
                    Xem tất cả
                  </Button>
                </div>
                {
                  searching ? (
                    <Skeleton className="h-14 w-full rounded-lg" />
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
                                    className='p-2 w-full'
                                    onPress={() => {
                                      router.push(`/products/product/${item._id}`)
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
          </div>
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
                "bg-default-200/50",
                "dark:bg-default/60",
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