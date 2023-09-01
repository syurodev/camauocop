'use client'

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"


interface ICategories {
  className?: string
}

const Categories: React.FC<ICategories> = ({ className }) => {
  return (
    <motion.section
      className={`glassmorphism w-full mt-5`}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      <ScrollArea className="h-fit w-full rounded-md border">
        <div className="flex">
          {/* TODO: MAP ITEM */}
          <Button variant={"ghost"}>
            <Link href={"/"}>1</Link>
          </Button>
          <Button variant={"ghost"}>
            <Link href={"/"}>2</Link>
          </Button>
          <Button variant={"ghost"}>
            <Link href={"/"}>3</Link>
          </Button>
          <Button variant={"ghost"}>
            <Link href={"/"}>4</Link>
          </Button>
          <Button variant={"ghost"}>
            <Link href={"/"}>5</Link>
          </Button>
          <Button variant={"ghost"}>
            <Link href={"/"}>6</Link>
          </Button>
          <Button variant={"ghost"}>
            <Link href={"/"}>7</Link>
          </Button>
          <Button variant={"ghost"}>
            <Link href={"/"}>8</Link>
          </Button>
          <Button variant={"ghost"}>
            <Link href={"/"}>9</Link>
          </Button>
          <Button variant={"ghost"}>
            <Link href={"/"}>10</Link>
          </Button>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </motion.section>
  );
}

export default Categories