import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  onClick,
  ...props 
}) => {
  const isClickable = !!onClick;
  
  return (
    <motion.div
      className={`
        bg-white rounded-lg border-2 border-gray-200 shadow-sm
        ${isClickable ? 'cursor-pointer hover:border-indigo-300 hover:shadow-md' : ''}
        ${className}
      `}
      onClick={onClick}
      whileHover={isClickable ? { scale: 1.02 } : {}}
      whileTap={isClickable ? { scale: 0.98 } : {}}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
