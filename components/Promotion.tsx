"use client";

import * as React from "react";
import { Button, Card, Image, Skeleton } from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";

import { getAdvertisement } from "@/actions/advertisement";

const Promotions: React.FC = () => {
  const [currentAdsIndex, setCurrentAdsIndex] = React.useState<number>(0);
  const [ads, setAds] = React.useState<Ads[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const fetchApi = async () => {
      setIsLoading(true)
      const res = await getAdvertisement({
        status: "running",
        type: "public"
      })
      setIsLoading(false)

      if (res.code === 200) {
        setAds(res.data!)
      }
    }
    fetchApi()
  }, [])

  const prevSlide = () => {
    if (ads) {
      if (currentAdsIndex <= 0) {
        setCurrentAdsIndex(ads?.length - 1);
      } else {
        setCurrentAdsIndex(currentAdsIndex - 1);
      }
    }
  };

  const nextSlide = () => {
    if (ads) {
      if (currentAdsIndex >= ads?.length - 1) {
        setCurrentAdsIndex(0);
      } else {
        setCurrentAdsIndex(currentAdsIndex + 1);
      }
    }
  };

  React.useEffect(() => {
    if (ads && ads.length > 1) {
      const interval = setInterval(() => {
        if (currentAdsIndex >= ads.length - 1) {
          setCurrentAdsIndex(0);
        } else {
          setCurrentAdsIndex(currentAdsIndex + 1);
        }
      }, 15000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [currentAdsIndex, ads]);

  return (
    <Card shadow="sm" className="w-full h-[15rem] sm:h-[20rem]">
      {
        isLoading ? (
          <Skeleton className="w-full h-full rounded-lg shadow-sm" />
        ) :
          ads && ads.length > 0 && (
            <AnimatePresence mode='wait'>
              <div
                className='relative w-full h-[15rem] sm:h-[20rem]'
              >
                <Button
                  isIconOnly
                  radius="full"
                  color='primary'
                  className={`absolute opacity-20 hover:opacity-100 transition-all duration-200 z-20 top-1/2 -translate-y-1/2 left-3 ${ads.length <= 1 ? "hidden" : "flex"}`}
                  onPress={prevSlide}
                >
                  <GrFormPrevious className="text-xl" />
                </Button>

                <Button
                  isIconOnly
                  radius="full"
                  color='primary'
                  className={`absolute opacity-20 hover:opacity-100 transition-all duration-200 z-20 top-1/2 -translate-y-1/2 right-3 ${ads.length <= 1 ? "hidden" : "flex"}`}
                  onPress={nextSlide}
                >
                  <GrFormNext className="text-xl" />
                </Button>

                {
                  ads.map((ads, index) => {
                    return (
                      index === currentAdsIndex && (
                        <motion.div
                          className='w-full h-[15rem] sm:h-[20rem]'
                          initial={{ y: 15, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: 15, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          key={index}
                        >
                          <Image
                            src={ads.image}
                            alt='ads'
                            width={"100%"}
                            radius='md'
                            className='w-full h-[15rem] sm:h-[20rem] object-cover z-10'
                          />
                        </motion.div>
                      )
                    )
                  })
                }
              </div>
            </AnimatePresence>
          )
      }
    </Card>
  );
};

export default Promotions;
