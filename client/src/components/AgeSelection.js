import React from 'react';
import { motion } from 'framer-motion';
import Card from './ui/Card';
import { useUser } from '../context/UserContext';
import { useAudio } from '../hooks/useAudio';

const AgeSelection = ({ onSelectAge }) => {
  const { setUser } = useUser();
  const { playSound } = useAudio();
  
  const handleAgeSelection = (ageGroup) => {
    playSound('click');
    setUser({ ageGroup });
    onSelectAge(ageGroup);
  };

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
    <motion.div
      className="flex flex-col items-center justify-center py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 
        className="text-3xl md:text-4xl font-bold mb-8 text-indigo-700 text-center"
        variants={itemVariants}
      >
        Which age group are you in?
      </motion.h1>
      
      <motion.div
        className="flex flex-col md:flex-row gap-8 w-full max-w-4xl"
        variants={itemVariants}
      >
        <motion.div 
          className="flex-1"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Card 
            onClick={() => handleAgeSelection('preStudents')}
            className="h-full bg-gradient-to-br from-yellow-200 to-orange-200 border-4 border-yellow-400 hover:border-yellow-500 cursor-pointer transition-all"
          >
            <div className="flex flex-col items-center text-center p-6">
              <motion.div 
                className="text-7xl mb-4"
                animate={{ 
                  y: [0, -8, 0],
                  rotate: [0, 5, 0, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              >
                🧸
              </motion.div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2 text-indigo-800">Pre-Students</h2>
              <p className="text-xl md:text-2xl font-bold text-pink-600 mb-4">Ages 3-5</p>
              <ul className="text-left text-indigo-700 space-y-2">
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Learn the alphabet with fun sounds
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Count numbers from 1 to 20
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Simple interactive quizzes
                </li>
              </ul>
            </div>
          </Card>
        </motion.div>
        
        <motion.div 
          className="flex-1"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Card 
            onClick={() => handleAgeSelection('elementary')}
            className="h-full bg-gradient-to-br from-blue-200 to-purple-200 border-4 border-blue-400 hover:border-blue-500 cursor-pointer transition-all"
          >
            <div className="flex flex-col items-center text-center p-6">
              <motion.div 
                className="text-7xl mb-4"
                animate={{ 
                  rotateY: [0, 180, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              >
                📚
              </motion.div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2 text-indigo-800">Class 1 & 2</h2>
              <p className="text-xl md:text-2xl font-bold text-pink-600 mb-4">Ages 6-8</p>
              <ul className="text-left text-indigo-700 space-y-2">
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Create sentences with simple words
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Basic math (addition, subtraction, multiplication)
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Image recognition activities
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Fun challenging quizzes
                </li>
              </ul>
            </div>
          </Card>
        </motion.div>
      </motion.div>
      
      <motion.p 
        className="mt-8 text-gray-600 text-center max-w-xl"
        variants={itemVariants}
      >
        Don't worry, parents can change this setting later from the parental controls.
      </motion.p>
    </motion.div>
  );
};

export default AgeSelection;
