"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "../ui/button";
import { RxDotFilled } from "react-icons/rx";

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
    <motion.section className="group w-1/2 !overflow-hidden flex items-center flex-col relative">
      {/* Next */}
      <Button
        variant={"secondary"}
        size={"icon"}
        className="hidden group-hover:flex transition-all duration-150 rounded-full absolute top-[50%] -translate-x-0 translate-y-[-50%] left-4 z-20"
        onClick={prevSlide}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.25 9l-3 3m0 0l3 3m-3-3h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </Button>
      {/* Prev */}
      <Button
        variant={"secondary"}
        size={"icon"}
        className="hidden group-hover:flex transition-all duration-150 rounded-full absolute top-[50%] -translate-x-0 translate-y-[-50%] right-4 z-20"
        onClick={nextSlide}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </Button>
      {/* Images */}
      <motion.div className="min-w-[500px] w-full h-[500px] pointer-events-none rounded-xl relative object-cover overflow-hidden">
        {images && (
          <Image
            src={images[currentIndex]}
            alt="product image"
            priority
            fill
            sizes="100%"
            style={{
              objectFit: "cover",
            }}
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
              className={`${
                index === currentIndex && "text-primary"
              } text-xl cursor-pointer transition-all duration-150`}
              onClick={() => goToSlide(index)}
            >
              <RxDotFilled />
            </div>
          ))}
      </div>
    </motion.section>
  );
};

export default SlideShow;
