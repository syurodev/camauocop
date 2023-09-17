"use client";

import * as React from "react";
import { motion } from "framer-motion";

const Promotions: React.FC = () => {
  return (
    <motion.section
      className="glassmorphism w-full h-[15rem] sm:h-[20rem]"
      initial={{ y: 0, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi sapiente
        iure architecto eaque est natus in sunt quis necessitatibus. Explicabo
        similique doloremque id veritatis. Voluptate suscipit blanditiis dolores
        earum ea.
      </p>
    </motion.section>
  );
};

export default Promotions;
