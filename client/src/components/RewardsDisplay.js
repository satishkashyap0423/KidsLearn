import React from 'react';
import { motion } from 'framer-motion';

const RewardsDisplay = ({ count = 0 }) => {
  // Determine the text and color based on the count
  const getStarLevel = () => {
    if (count >= 100) return { text: 'Master', color: 'text-yellow-500' };
    if (count >= 75) return { text: 'Expert', color: 'text-purple-500' };
    if (count >= 50) return { text: 'Advanced', color: 'text-blue-500' };
    if (count >= 25) return { text: 'Intermediate', color: 'text-green-500' };
    return { text: 'Beginner', color: 'text-orange-500' };
  };

  const { text, color } = getStarLevel();

  // Stars animation variants
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      }
    }
  };

  const starVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: { 
      scale: 1, 
      rotate: 0,
      transition: { 
        type: 'spring',
        stiffness: 260,
        damping: 20 
      }
    }
  };

  return (
    <div className="flex items-center space-x-1">
      <motion.div 
        className="flex items-center"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <motion.div
          className="flex items-center justify-center w-8 h-8 bg-yellow-400 rounded-full shadow-md"
          variants={starVariants}
          whileHover={{ scale: 1.1, rotate: 20 }}
        >
          <span className="text-lg">⭐</span>
        </motion.div>
      </motion.div>
      
      <div className="flex flex-col">
        <span className="font-bold text-sm">{count}</span>
        <span className={`text-xs ${color}`}>{text}</span>
      </div>
    </div>
  );
};

export default RewardsDisplay;
