"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CiMenuKebab } from "react-icons/ci"
import { Accordion, AccordionItem, Button, Card, CardBody, CardFooter, useDisclosure, Pagination, Skeleton, User } from "@nextui-org/react";
import { useRouter } from "next/navigation";

import { getDestinations, searchTours } from "@/actions/tourisms";
import TourDetail from "@/components/modal/TourDetail";
import { formattedPriceWithUnit } from "@/lib/formattedPriceWithUnit";

type IProps = {
  params: {
    slug: string;
  };
};

const TourismsPage: React.FC<IProps> = ({ params }) => {

  const router = useRouter()
  const slug = decodeURIComponent(params.slug);
  const [data, setData] = useState<TourData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [destinationsLoading, setDestinationsLoading] = useState<boolean>(true);
  const [destinations, setDestinations] = useState<DestinationData[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [tourSelected, setTourSelected] = useState({
    _id: "",
    name: ""
  })
  const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const res = await searchTours(slug, page);
      setIsLoading(false)

      if (res.code === 200) {
        setData(JSON.parse(res.data!))
        setTotalPages(res.totalPages)
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.slug]);

  useEffect(() => {
    const fetchApi = async () => {
      setDestinationsLoading(true)
      const res = await getDestinations()
      if (res.code === 200) {
        setDestinations(JSON.parse(res.data!))
      }
      setDestinationsLoading(false)
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

                <Accordion
                  variant="bordered"
                  isCompact
                >
                  <AccordionItem key="1" aria-label="Điểm đến" title="Điểm đến">
                    <div className="flex flex-col gap-3">
                      {
                        destinations.map((destination, index) => {
                          return (
                            <Button
                              key={index}
                              variant="flat"
                              className="border-none"
                              size="sm"
                              onPress={() => router.push(`/products/${destination._id}`)}
                            >
                              {
                                destination.name
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

          <Accordion
            variant="bordered"
            isCompact
          >
            <AccordionItem key="1" aria-label="Điểm đến" title="Điểm đến">
              <div className="flex flex-col gap-3">
                {
                  destinations.map((destination, index) => {
                    return (
                      <Button
                        key={index}
                        variant="flat"
                        className="border-none"
                        size="sm"
                        onPress={() => router.push(`/tourisms/${destination._id}`)}
                      >
                        {
                          destination.name
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
          className="flex flex-col items-center w-full"
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

            {/* <Dropdown>
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
            </Dropdown> */}
          </div>

          <div className="w-full grid items-center sm:grid-cols-2 grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4 xl:gap-5">
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
              ) : data && data.length > 0 ? data.map((tour, index) => (
                <motion.div
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 15, opacity: 0 }}
                  transition={{ duration: 0.3, delay: index / 10 }}
                  key={tour?._id}
                >
                  <Card
                    key={tour._id}
                    shadow='sm'
                    radius="lg"
                    className="border-none m-auto h-64"
                    isPressable
                    onPress={() => {
                      setTourSelected({
                        _id: tour._id,
                        name: tour.tourName
                      })
                      onOpen()
                    }}
                  >
                    <CardBody className='flex flex-col gap-3 items-start'>
                      <User
                        name={tour.username}
                        avatarProps={{
                          src: tour.avatar
                        }}
                      />
                      <h3 className='font-semibold'>
                        {tour.tourName}
                      </h3>

                      <div>
                        <p><span className='font-semibold'>Loại tour: </span><span>{tour.tourTypeName}</span></p>
                        <p><span className='font-semibold'>Giá: </span><span className='text-primary'>{tour.price > 0 ? formattedPriceWithUnit(tour.price) : "Thương lượng"}</span></p>
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>
              )) : <span>Không có tour</span>
            }
          </div>

          <Pagination showControls total={totalPages || 1} initialPage={page} onChange={setPage} className="mt-3" />
        </motion.div>
      </AnimatePresence>

      {
        isOpen && (
          <TourDetail
            data={tourSelected}
            isOpen={isOpen}
            onClose={onClose}
            onOpenChange={onOpenChange}
          />
        )
      }
    </div>
  )
}

export default TourismsPage