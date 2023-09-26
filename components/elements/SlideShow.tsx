"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Image } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { LuDot } from "react-icons/lu";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";

type IProps = {
  images: string[];
};
const SlideShow: React.FC<IProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    if (images) {
      if (currentIndex <= 0) {
        setCurrentIndex(images?.length - 1);
      } else {
        setCurrentIndex(currentIndex - 1);
      }
    }
  };

  const nextSlide = () => {
    if (images) {
      if (currentIndex >= images?.length - 1) {
        setCurrentIndex(0);
      } else {
        setCurrentIndex(currentIndex + 1);
      }
    }
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <motion.section className="group w-full lg:w-1/2 !overflow-hidden flex items-center flex-col relative rounded-lg">
      {/* Next */}
      <Button
        isIconOnly
        radius="full"
        className="opacity-0 group-hover:opacity-100 transition-all duration-200 absolute top-[50%] -translate-x-0 translate-y-[-50%] left-4 z-20"
        onClick={prevSlide}
      >
        <GrFormPrevious className="text-xl" />
      </Button>
      {/* Prev */}
      <Button
        isIconOnly
        radius="full"
        className="opacity-0 group-hover:opacity-100 transition-all !text-white duration-200 absolute top-[50%] -translate-x-0 translate-y-[-50%] right-4 z-20"
        onClick={nextSlide}
      >
        <GrFormNext className="text-xl" />
      </Button>
      {/* Images */}
      <motion.div className="min-w-[500px] w-full h-[500px] flex items-center justify-center relative object-cover overflow-hidden">
        {images && (
          <Image
            src={images[currentIndex]}
            isZoomed
            shadow="sm"
            radius="lg"
            width={"auto"}
            height={"full"}
            alt="product image"
            className="object-cover"
          />
        )}
        {/* {images &&
          images.map((image, index) => {
            return (
              <motion.div
                key={index}
                className="min-w-[500px] w-1/2 h-[500px] pointer-events-none rounded-xl relative object-cover overflow-hidden"
              >
                <Image
                  src={image}
                  alt="product image"
                  priority
                  fill
                  sizes="100%"
                  style={{
                    objectFit: "cover",
                  }}
                />
              </motion.div>
            );
          })} */}
      </motion.div>

      {/* Dot */}
      <div className="flex items-center gap-4 my-3">
        {images &&
          images.map((image, index) => (
            <div
              key={index}
              className={`${index === currentIndex && "text-primary"
                } text-xl cursor-pointer transition-all duration-150`}
              onClick={() => goToSlide(index)}
            >
              <LuDot />
            </div>
          ))}
      </div>
    </motion.section>
  );
};

export default SlideShow;
