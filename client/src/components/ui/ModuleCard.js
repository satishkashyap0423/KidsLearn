import React from 'react';
import { motion } from 'framer-motion';
import Card from './Card';

const ModuleCard = ({
  title,
  description,
  icon,
  color = 'bg-indigo-200',
  borderColor = 'border-indigo-400',
  progress = 0,
  onClick,
}) => {
  return (
    <Card
      className={`${color} border-2 ${borderColor} p-5 overflow-hidden relative`}
      onClick={onClick}
    >
      <div className="flex flex-col h-full z-10 relative">
        <div className="mb-4 flex justify-between items-start">
          <motion.div
            className="text-5xl"
            animate={{ 
              rotate: [0, 10, 0, -10, 0],
              scale: [1, 1.2, 1, 1.2, 1]
            }}
            transition={{ 
              duration: 5,
              repeat: Infinity,
              repeatType: "loop"
            }}
          >
            {icon}
          </motion.div>
          
          <div className="bg-white bg-opacity-80 rounded-full px-2 py-1 text-xs font-bold">
            {progress}%
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-indigo-800 mb-2">{title}</h3>
        <p className="text-indigo-700">{description}</p>
        
        {progress > 0 && (
          <div className="mt-4">
            <div className="h-2 bg-white bg-opacity-50 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-indigo-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        )}
      </div>
      
      <motion.div
        className="absolute -bottom-16 -right-16 w-32 h-32 rounded-full bg-white bg-opacity-20"
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0]
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          repeatType: "loop"
        }}
      />
    </Card>
  );
};

export default ModuleCard;
