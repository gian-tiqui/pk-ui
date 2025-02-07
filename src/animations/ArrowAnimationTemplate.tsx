import React, { ReactNode } from "react";
import { motion } from "framer-motion";

interface Props {
  children?: ReactNode;
}

const ArrowAnimationTemplate: React.FC<Props> = ({ children }) => {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }} // Ensures it scales down when removed
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export default ArrowAnimationTemplate;
