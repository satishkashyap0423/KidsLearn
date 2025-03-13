import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Tone from 'tone';
import Button from './ui/Button';
import Card from './ui/Card';
import Modal from './ui/Modal';
import { useAudio } from '../hooks/useAudio';
import { useProgress } from '../context/ProgressContext';
import { useUser } from '../context/UserContext';
import counting from '../data/counting';

const CountingModule = ({ onBack }) => {
  const { playSound } = useAudio();
  const { updateProgress } = useProgress();
  const { user } = useUser();
  const [currentNumIndex, setCurrentNumIndex] = useState(0);
  const [mode, setMode] = useState('learn'); // 'learn' or 'quiz'
  const [quizOptions, setQuizOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [completedNumbers, setCompletedNumbers] = useState([]);
  
  // Get the max number based on age group
  const maxNumber = user.ageGroup === 'preStudents' ? 10 : 20;
  const filteredCounting = counting.filter(num => num.number <= maxNumber);
  
  const currentNum = filteredCounting[currentNumIndex];
  
  // Generate quiz options
  useEffect(() => {
    if (mode === 'quiz') {
      // Get the correct answer
      const correctAnswer = currentNum;
      
      // Get 3 random wrong answers
      const wrongAnswers = [];
      while (wrongAnswers.length < 3) {
        const randomIndex = Math.floor(Math.random() * filteredCounting.length);
        if (randomIndex !== currentNumIndex && !wrongAnswers.includes(filteredCounting[randomIndex])) {
          wrongAnswers.push(filteredCounting[randomIndex]);
        }
      }
      
      // Combine and shuffle
      const options = [correctAnswer, ...wrongAnswers];
      for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
      }
      
      setQuizOptions(options);
    }
  }, [currentNumIndex, mode, filteredCounting]);
  
  // Update progress when a number is completed
  useEffect(() => {
    if (completedNumbers.length > 0) {
      const progress = Math.floor((completedNumbers.length / filteredCounting.length) * 100);
      updateProgress('counting', progress);
    }
  }, [completedNumbers, updateProgress, filteredCounting.length]);
  
  // Play number sound when in learn mode - only when currentNumIndex or mode changes
  useEffect(() => {
    if (mode === 'learn') {
      // Only play the sound when the number changes or mode changes
      // Use enhanced pronunciation with word association
      playSound('number', currentNum.number.toString(), { withWord: true });
    }
  }, [currentNumIndex, mode, playSound, currentNum]);
  
  const handleNextNumber = () => {
    playSound('click');
    if (currentNumIndex < filteredCounting.length - 1) {
      setCurrentNumIndex(prevIndex => prevIndex + 1);
    } else {
      // End of counting reached
      setShowModal(true);
    }
    setMode('learn');
    setShowResult(false);
    setSelectedOption(null);
  };
  
  const handlePrevNumber = () => {
    playSound('click');
    if (currentNumIndex > 0) {
      setCurrentNumIndex(prevIndex => prevIndex - 1);
    }
    setMode('learn');
    setShowResult(false);
    setSelectedOption(null);
  };
  
  const handleQuizMode = () => {
    playSound('click');
    setMode('quiz');
    setShowResult(false);
    setSelectedOption(null);
  };
  
  const handleLearnMode = () => {
    playSound('click');
    setMode('learn');
  };
  
  const handleOptionSelect = (option) => {
    playSound('click');
    setSelectedOption(option);
    
    const correct = option.number === currentNum.number;
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      playSound('correct');
      // Add to completed numbers if not already there
      if (!completedNumbers.includes(currentNum.number)) {
        setCompletedNumbers(prev => [...prev, currentNum.number]);
      }
    } else {
      playSound('incorrect');
    }
  };
  
  // Create an array of items for current number visualization
  const itemsArray = Array.from({ length: currentNum.number }, (_, i) => i);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    },
    exit: { opacity: 0 }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 }
  };

  return (
    <div className="py-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div 
          className="flex justify-between items-center mb-6"
          variants={itemVariants}
        >
          <Button onClick={onBack} className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-indigo-700">Counting Adventure</h1>
            <p className="text-indigo-600">Learn to count with fun activities</p>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              onClick={handleLearnMode} 
              className={`${mode === 'learn' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'}`}
            >
              Learn
            </Button>
            <Button 
              onClick={handleQuizMode} 
              className={`${mode === 'quiz' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700'}`}
            >
              Quiz
            </Button>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6 mb-6 max-w-4xl mx-auto"
          variants={itemVariants}
        >
          <div className="flex flex-col items-center">
            {mode === 'learn' ? (
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentNum.number}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center w-full"
                >
                  <motion.div 
                    className="text-8xl font-bold text-indigo-600 mb-4 select-none cursor-pointer"
                    onClick={() => {
                      // To avoid audio initialization issues, check if Tone context is running
                      // and start it if needed (this requires user interaction)
                      if (!Tone.context || Tone.context.state !== 'running') {
                        console.log('Starting audio context on number click...');
                        Tone.start().then(() => {
                          console.log('Audio context started, playing number sound...');
                          playSound('number', currentNum.number.toString(), { withWord: true });
                        }).catch(err => {
                          console.error('Failed to start audio context:', err);
                        });
                      } else {
                        // Play number with word pronunciation (e.g., "1 is One")
                        console.log('Audio context already running, playing number sound directly');
                        playSound('number', currentNum.number.toString(), { withWord: true });
                      }
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {currentNum.number}
                  </motion.div>
                  
                  <motion.p 
                    className="text-2xl text-indigo-700 font-semibold mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {currentNum.word}
                  </motion.p>
                  
                  <div className="w-full my-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex flex-wrap justify-center gap-3">
                      {itemsArray.map((item, index) => (
                        <motion.div
                          key={index}
                          className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full text-white font-bold text-xl shadow-md"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ 
                            scale: 1, 
                            rotate: 0,
                            y: [0, -10, 0]
                          }}
                          transition={{ 
                            delay: index * 0.1,
                            y: {
                              delay: 0.5 + index * 0.1,
                              duration: 0.5, 
                              repeat: 1
                            }
                          }}
                        >
                          {index + 1}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  {currentNum.examples && (
                    <motion.p 
                      className="text-gray-600 text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      Examples: {currentNum.examples}
                    </motion.p>
                  )}
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="w-full">
                <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
                  How many {currentNum.quizItem || 'items'} do you see?
                </h2>
                
                <div className="w-full my-4 p-4 bg-purple-50 rounded-lg border border-purple-200 mb-6">
                  <div className="flex flex-wrap justify-center gap-3">
                    {itemsArray.map((item, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full text-white font-bold shadow-md"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        {currentNum.emoji}
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {quizOptions.map((option, index) => (
                    <Card 
                      key={index}
                      onClick={() => !showResult && handleOptionSelect(option)}
                      className={`p-4 cursor-pointer transition-all ${
                        selectedOption === option ? 
                          (isCorrect ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500') : 
                          'hover:border-blue-500'
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-5xl font-bold text-indigo-600 mb-2">
                          {option.number}
                        </span>
                        <span className="text-xl text-gray-700">{option.word}</span>
                      </div>
                    </Card>
                  ))}
                </div>
                
                {showResult && (
                  <motion.div 
                    className={`mt-6 p-4 rounded-lg text-center ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {isCorrect ? (
                      <div>
                        <p className="text-xl font-bold text-green-700 mb-2">Correct!</p>
                        <p className="text-green-600">
                          There are {currentNum.number} {currentNum.quizItem || 'items'}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xl font-bold text-red-700 mb-2">Not quite!</p>
                        <p className="text-red-600">
                          The correct answer is {currentNum.number}
                        </p>
                      </div>
                    )}
                    <Button 
                      onClick={handleNextNumber}
                      className="mt-4 bg-indigo-600 text-white"
                    >
                      Next Number
                    </Button>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </motion.div>
        
        {mode === 'learn' && (
          <motion.div 
            className="flex justify-between items-center max-w-4xl mx-auto"
            variants={itemVariants}
          >
            <Button 
              onClick={handlePrevNumber}
              disabled={currentNumIndex === 0}
              className={`${currentNumIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </Button>
            
            <div className="text-center">
              <span className="text-lg font-bold text-indigo-700">
                {currentNumIndex + 1} of {filteredCounting.length}
              </span>
              <div className="flex mt-2 flex-wrap justify-center max-w-md">
                {filteredCounting.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full mx-1 mb-1 ${
                      index === currentNumIndex ? 'bg-indigo-600' : 
                      completedNumbers.includes(filteredCounting[index].number) ? 'bg-green-400' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <Button 
              onClick={handleNextNumber}
              disabled={currentNumIndex === filteredCounting.length - 1 && mode === 'learn'}
              className={`${currentNumIndex === filteredCounting.length - 1 && mode === 'learn' ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Next
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </motion.div>
        )}
        
        {/* Completion Modal */}
        <Modal 
          isOpen={showModal} 
          onClose={() => setShowModal(false)}
          title="Congratulations!"
        >
          <div className="text-center">
            <motion.div 
              className="text-6xl mb-4"
              animate={{ 
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 1, repeat: Infinity, repeatType: "loop" }}
            >
              🎉
            </motion.div>
            <h3 className="text-2xl font-bold text-indigo-700 mb-4">
              You've completed Counting to {maxNumber}!
            </h3>
            <p className="text-indigo-600 mb-6">
              You've learned to count from 1 to {maxNumber}. Amazing work!
            </p>
            <div className="flex justify-center space-x-4">
              <Button 
                onClick={() => {
                  setShowModal(false);
                  onBack();
                }}
                className="bg-indigo-600 text-white"
              >
                Back to Dashboard
              </Button>
              <Button 
                onClick={() => {
                  setShowModal(false);
                  setCurrentNumIndex(0);
                  setMode('learn');
                }}
              >
                Start Over
              </Button>
            </div>
          </div>
        </Modal>
      </motion.div>
    </div>
  );
};

export default CountingModule;
