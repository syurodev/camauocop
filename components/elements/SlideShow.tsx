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
    <motion.section className="group w-full lg:w-1/2 !overflow-hidden flex items-center flex-col relative">
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
        className="opacity-0 group-hover:opacity-100 transition-all duration-200 absolute top-[50%] -translate-x-0 translate-y-[-50%] right-4 z-20"
        onClick={nextSlide}
      >
        <GrFormNext className="text-xl" />
      </Button>
      {/* Images */}
      <motion.div
        className="min-w-[500px] w-full h-[600px]
      flex items-center justify-center relative object-cover overflow-hidden"
      >
        {images && (
          <Image
            src={images[currentIndex]}
            isZoomed
            radius="lg"
            width={"full"}
            height={"auto"}
            alt="product image"
            className="object-cover h-auto max-h-[600px]"
          />
        )}
      </motion.div>

      {/* Dot */}
      <div className="flex items-center gap-2 my-3">
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
