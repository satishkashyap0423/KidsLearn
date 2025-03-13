import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from './ui/Button';
import { useAudio } from '../hooks/useAudio';

const HomePage = ({ onStartClick }) => {
  const { playSound } = useAudio();
  
  useEffect(() => {
    // Play welcome sound when component mounts
    playSound('welcome');
  }, [playSound]);

  // Animation variants
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
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const floatingAnimation = {
    y: ['-5%', '5%'],
    transition: {
      y: {
        duration: 2,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut'
      }
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[80vh] text-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="mb-8"
        variants={itemVariants}
        animate={floatingAnimation}
      >
        <motion.svg 
          className="w-32 h-32 md:w-48 md:h-48 text-indigo-600" 
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ 
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            repeatType: "loop" 
          }}
        >
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
          <circle cx="12" cy="12" r="10" />
          <path d="M15 9l-6 6" />
          <path d="M9 9l6 6" />
        </motion.svg>
      </motion.div>
      
      <motion.h1 
        className="text-4xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400"
        variants={itemVariants}
      >
        KidLearn
      </motion.h1>
      
      <motion.p 
        className="text-xl md:text-2xl mb-8 text-indigo-700"
        variants={itemVariants}
      >
        A fun learning adventure for curious minds!
      </motion.p>
      
      <motion.div
        className="flex flex-wrap justify-center gap-4 mb-12"
        variants={itemVariants}
      >
        <div className="bg-yellow-200 p-4 rounded-lg shadow-md">
          <span className="text-2xl">🔤</span>
          <p className="font-bold">Alphabet</p>
        </div>
        <div className="bg-green-200 p-4 rounded-lg shadow-md">
          <span className="text-2xl">🔢</span>
          <p className="font-bold">Counting</p>
        </div>
        <div className="bg-blue-200 p-4 rounded-lg shadow-md">
          <span className="text-2xl">📝</span>
          <p className="font-bold">Sentences</p>
        </div>
        <div className="bg-pink-200 p-4 rounded-lg shadow-md">
          <span className="text-2xl">🧮</span>
          <p className="font-bold">Math</p>
        </div>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <Button 
          onClick={() => {
            playSound('click');
            onStartClick();
          }}
          className="text-xl md:text-2xl py-4 px-8 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl"
          icon={
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          }
        >
          Start Learning!
        </Button>
      </motion.div>
      
      <motion.div 
        className="mt-12 flex flex-wrap justify-center gap-6"
        variants={itemVariants}
      >
        <div className="text-center">
          <div className="text-3xl mb-2">🎓</div>
          <p className="text-gray-700">For Ages 3-8</p>
        </div>
        <div className="text-center">
          <div className="text-3xl mb-2">🎮</div>
          <p className="text-gray-700">Fun Interactive Games</p>
        </div>
        <div className="text-center">
          <div className="text-3xl mb-2">🏆</div>
          <p className="text-gray-700">Earn Rewards</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HomePage;
