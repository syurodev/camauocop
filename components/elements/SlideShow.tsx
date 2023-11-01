"use client";

import React, { useState } from "react";
import { Image } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { LuDot } from "react-icons/lu";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";

type IProps = {
  images: string[];
  w?: string,
  h?: string
};
const SlideShow: React.FC<IProps> = ({ images, w = "w-full lg:w-1/2", h = "h-[600px]" }) => {
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
    <section className={`group ${w} !overflow-hidden flex items-center flex-col relative`}>
      {/* Next */}
      <Button
        isIconOnly
        radius="full"
        color="primary"
        className={`opacity-0 group-hover:opacity-100 transition-all duration-200 absolute top-[50%] -translate-x-0 translate-y-[-50%] left-4 z-20 ${images.length <= 1 ? "hidden" : ""}`}
        onClick={prevSlide}
      >
        <GrFormPrevious className="text-xl" />
      </Button>
      {/* Prev */}
      <Button
        isIconOnly
        radius="full"
        color="primary"
        className={`opacity-0 group-hover:opacity-100 transition-all duration-200 absolute top-[50%] -translate-x-0 translate-y-[-50%] right-4 z-20 ${images.length <= 1 ? "hidden" : ""}`}
        onClick={nextSlide}
      >
        <GrFormNext className="text-xl" />
      </Button>
      {/* Images */}
      <div
        className={`w-full ${h} rounded-xl
        flex items-center justify-center relative object-cover overflow-hidden`}
      >
        {images && (
          <Image
            src={images[currentIndex]}
            isZoomed
            radius="lg"
            height={"100%"}
            alt="product image"
            className="object-cover h-auto max-h-[600px] w-full"
          />
        )}
      </div>

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
    </section>
  );
};

export default SlideShow;
