import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import ModuleCard from './ui/ModuleCard';
import ProgressTracker from './ProgressTracker';
import { useAudio } from '../hooks/useAudio';
import { useProgress } from '../context/ProgressContext';

const PreStudentsDashboard = ({ onModuleSelect }) => {
  const { playSound } = useAudio();
  const { progress } = useProgress();
  
  useEffect(() => {
    playSound('dashboard');
  }, [playSound]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="py-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mb-8"
      >
        <motion.h1 
          className="text-3xl md:text-4xl font-bold mb-4 text-indigo-700 text-center"
          variants={itemVariants}
        >
          Welcome, Little Explorer!
        </motion.h1>
        
        <motion.p 
          className="text-xl text-center text-indigo-600 mb-6"
          variants={itemVariants}
        >
          Choose an activity to start learning
        </motion.p>
        
        <motion.div 
          className="mb-8"
          variants={itemVariants}
        >
          <ProgressTracker 
            progress={{
              alphabet: progress?.modules?.alphabet?.progress || 0,
              counting: progress?.modules?.counting?.progress || 0
            }}
          />
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          variants={itemVariants}
        >
          <ModuleCard
            title="Learn the Alphabet"
            description="Discover letters and their sounds with fun activities"
            icon="🔤"
            color="bg-gradient-to-br from-pink-200 to-pink-300"
            borderColor="border-pink-400"
            progress={progress?.modules?.alphabet?.progress || 0}
            onClick={() => {
              playSound('click');
              onModuleSelect('alphabet');
            }}
          />
          
          <ModuleCard
            title="Counting Numbers"
            description="Learn to count from 1 to 20 with interactive games"
            icon="🔢"
            color="bg-gradient-to-br from-yellow-200 to-orange-300"
            borderColor="border-yellow-400"
            progress={progress?.modules?.counting?.progress || 0}
            onClick={() => {
              playSound('click');
              onModuleSelect('counting');
            }}
          />
        </motion.div>
        
        <motion.div 
          className="mt-12 bg-blue-100 rounded-xl p-6 max-w-4xl mx-auto shadow-md"
          variants={itemVariants}
        >
          <h2 className="text-xl font-bold text-indigo-700 mb-3">Parent Tip:</h2>
          <p className="text-indigo-600">
            Encourage your child to complete activities in both modules. Spend about 15-20 minutes per day for the best learning experience.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PreStudentsDashboard;
