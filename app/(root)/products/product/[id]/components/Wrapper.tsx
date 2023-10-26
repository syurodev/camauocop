"use client"
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <AnimatePresence mode='wait'>
      <motion.div
        key={"productDetail"}
        initial={{ width: "100%" }}
        animate={{ width: "100%" }}
        exit={{ width: "100%" }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
