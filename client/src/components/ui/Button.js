import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  className = '', 
  onClick, 
  disabled = false, 
  type = 'button',
  icon = null,
  ...props 
}) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 rounded-lg font-medium transition-all
        flex items-center justify-center
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md active:scale-95'}
        ${className}
      `}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </motion.button>
  );
};

export default Button;
