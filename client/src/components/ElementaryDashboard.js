import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import ModuleCard from './ui/ModuleCard';
import ProgressTracker from './ProgressTracker';
import { useAudio } from '../hooks/useAudio';
import { useProgress } from '../context/ProgressContext';

const ElementaryDashboard = ({ onModuleSelect }) => {
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
      >
        <motion.h1 
          className="text-3xl md:text-4xl font-bold mb-4 text-indigo-700 text-center"
          variants={itemVariants}
        >
          Hello, Young Learner!
        </motion.h1>
        
        <motion.p 
          className="text-xl text-center text-indigo-600 mb-6"
          variants={itemVariants}
        >
          What would you like to learn today?
        </motion.p>
        
        <motion.div 
          className="mb-8"
          variants={itemVariants}
        >
          <ProgressTracker 
            progress={{
              alphabet: progress?.modules?.alphabet?.progress || 0,
              counting: progress?.modules?.counting?.progress || 0,
              sentences: progress?.modules?.sentences?.progress || 0,
              math: progress?.modules?.math?.progress || 0,
              images: progress?.modules?.images?.progress || 0
            }}
          />
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
          variants={itemVariants}
        >
          <ModuleCard
            title="Learn the Alphabet"
            description="Master letters and their sounds with fun activities"
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
            title="Counting & Numbers"
            description="Count and identify numbers with interactive games"
            icon="🔢"
            color="bg-gradient-to-br from-yellow-200 to-orange-300"
            borderColor="border-yellow-400"
            progress={progress?.modules?.counting?.progress || 0}
            onClick={() => {
              playSound('click');
              onModuleSelect('counting');
            }}
          />
          
          <ModuleCard
            title="Sentence Creation"
            description="Learn to form simple sentences with words"
            icon="📝"
            color="bg-gradient-to-br from-green-200 to-green-300"
            borderColor="border-green-400"
            progress={progress?.modules?.sentences?.progress || 0}
            onClick={() => {
              playSound('click');
              onModuleSelect('sentences');
            }}
          />
          
          <ModuleCard
            title="Math Adventures"
            description="Addition, subtraction and multiplication fun"
            icon="🧮"
            color="bg-gradient-to-br from-blue-200 to-blue-300"
            borderColor="border-blue-400"
            progress={progress?.modules?.math?.progress || 0}
            onClick={() => {
              playSound('click');
              onModuleSelect('math');
            }}
          />
          
          <ModuleCard
            title="Image Recognition"
            description="Identify objects and animals in pictures"
            icon="🖼️"
            color="bg-gradient-to-br from-purple-200 to-purple-300"
            borderColor="border-purple-400"
            progress={progress?.modules?.images?.progress || 0}
            onClick={() => {
              playSound('click');
              onModuleSelect('images');
            }}
          />
        </motion.div>
        
        <motion.div 
          className="mt-12 bg-blue-100 rounded-xl p-6 max-w-6xl mx-auto shadow-md"
          variants={itemVariants}
        >
          <h2 className="text-xl font-bold text-indigo-700 mb-3">Learning Tip:</h2>
          <p className="text-indigo-600">
            Try to complete at least one activity from each module every week. This will help build a strong foundation across all subjects!
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ElementaryDashboard;
