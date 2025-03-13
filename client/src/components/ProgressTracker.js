import React from 'react';
import { motion } from 'framer-motion';

const ProgressTracker = ({ progress }) => {
  // Calculate the overall progress as an average
  const calculateOverallProgress = () => {
    const modules = Object.values(progress);
    if (modules.length === 0) return 0;
    
    const sum = modules.reduce((total, current) => total + current, 0);
    return Math.floor(sum / modules.length);
  };
  
  const overallProgress = calculateOverallProgress();
  
  // Get color based on progress
  const getProgressColor = (value) => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 40) return 'bg-yellow-500';
    return 'bg-orange-400';
  };
  
  const progressBarVariants = {
    hidden: { width: 0 },
    visible: (progress) => ({
      width: `${progress}%`,
      transition: { 
        duration: 1.5,
        ease: "easeOut"
      }
    })
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold text-indigo-700">Overall Progress</h3>
          <span className="text-sm font-medium text-indigo-600">{overallProgress}%</span>
        </div>
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${getProgressColor(overallProgress)}`}
            variants={progressBarVariants}
            initial="hidden"
            animate="visible"
            custom={overallProgress}
          />
        </div>
      </div>
      
      <div className="space-y-3">
        {Object.entries(progress).map(([module, value]) => (
          <div key={module}>
            <div className="flex justify-between items-center mb-1">
              <h4 className="text-sm font-medium text-gray-700 capitalize">
                {module === 'images' ? 'Image Recognition' : module}
              </h4>
              <span className="text-xs font-medium text-gray-600">{value}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${getProgressColor(value)}`}
                variants={progressBarVariants}
                initial="hidden"
                animate="visible"
                custom={value}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressTracker;
