import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './ui/Button';
import Card from './ui/Card';
import Modal from './ui/Modal';
import { useAudio } from '../hooks/useAudio';
import { useProgress } from '../context/ProgressContext';
import math from '../data/math';

const MathModule = ({ onBack }) => {
  const { playSound } = useAudio();
  const { updateProgress } = useProgress();
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [mode, setMode] = useState('learn'); // 'learn' or 'practice'
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [completedProblems, setCompletedProblems] = useState([]);
  const [operationFilter, setOperationFilter] = useState('all'); // 'all', 'addition', 'subtraction', 'multiplication'
  
  // Filter math problems based on selected operation
  const filteredProblems = operationFilter === 'all' 
    ? math 
    : math.filter(problem => problem.operation === operationFilter);
  
  const currentProblem = filteredProblems[currentProblemIndex];
  
  // Update progress when a problem is completed
  useEffect(() => {
    if (completedProblems.length > 0) {
      const progress = Math.floor((completedProblems.length / math.length) * 100);
      updateProgress('math', progress);
    }
  }, [completedProblems, updateProgress]);
  
  const handleNextProblem = () => {
    playSound('click');
    if (currentProblemIndex < filteredProblems.length - 1) {
      setCurrentProblemIndex(prevIndex => prevIndex + 1);
    } else {
      // End of problems reached
      setShowModal(true);
    }
    setMode('learn');
    setShowResult(false);
    setUserAnswer('');
  };
  
  const handlePrevProblem = () => {
    playSound('click');
    if (currentProblemIndex > 0) {
      setCurrentProblemIndex(prevIndex => prevIndex - 1);
    }
    setMode('learn');
    setShowResult(false);
    setUserAnswer('');
  };
  
  const handlePracticeMode = () => {
    playSound('click');
    setMode('practice');
    setShowResult(false);
    setUserAnswer('');
  };
  
  const handleLearnMode = () => {
    playSound('click');
    setMode('learn');
  };
  
  const handleUserInput = (e) => {
    // Only allow numbers
    const value = e.target.value.replace(/[^0-9]/g, '');
    setUserAnswer(value);
  };
  
  const handleCheckAnswer = () => {
    playSound('click');
    
    const correct = parseInt(userAnswer) === currentProblem.answer;
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      playSound('correct');
      // Add to completed problems if not already there
      if (!completedProblems.includes(currentProblem.id)) {
        setCompletedProblems(prev => [...prev, currentProblem.id]);
      }
    } else {
      playSound('incorrect');
    }
  };
  
  // Get operation symbol
  const getOperationSymbol = (op) => {
    switch (op) {
      case 'addition': return '+';
      case 'subtraction': return '-';
      case 'multiplication': return '×';
      default: return '';
    }
  };
  
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
            <h1 className="text-2xl md:text-3xl font-bold text-indigo-700">Math Adventures</h1>
            <p className="text-indigo-600">Learn basic math operations</p>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              onClick={handleLearnMode} 
              className={`${mode === 'learn' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'}`}
            >
              Learn
            </Button>
            <Button 
              onClick={handlePracticeMode} 
              className={`${mode === 'practice' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700'}`}
            >
              Practice
            </Button>
          </div>
        </motion.div>
        
        {/* Operation filter */}
        <motion.div 
          className="mb-6 flex justify-center"
          variants={itemVariants}
        >
          <div className="bg-white rounded-full shadow-md p-1 flex space-x-1">
            <Button 
              onClick={() => setOperationFilter('all')}
              className={`rounded-full px-4 ${operationFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}
            >
              All
            </Button>
            <Button 
              onClick={() => setOperationFilter('addition')}
              className={`rounded-full px-4 ${operationFilter === 'addition' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}
            >
              Addition (+)
            </Button>
            <Button 
              onClick={() => setOperationFilter('subtraction')}
              className={`rounded-full px-4 ${operationFilter === 'subtraction' ? 'bg-red-600 text-white' : 'bg-gray-100'}`}
            >
              Subtraction (-)
            </Button>
            <Button 
              onClick={() => setOperationFilter('multiplication')}
              className={`rounded-full px-4 ${operationFilter === 'multiplication' ? 'bg-yellow-600 text-white' : 'bg-gray-100'}`}
            >
              Multiplication (×)
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
                  key={currentProblem.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center w-full"
                >
                  <motion.div 
                    className="text-5xl font-bold mb-8 text-center"
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <span className={
                      currentProblem.operation === 'addition' ? 'text-green-600' :
                      currentProblem.operation === 'subtraction' ? 'text-red-600' :
                      'text-yellow-600'
                    }>
                      {currentProblem.num1} {getOperationSymbol(currentProblem.operation)} {currentProblem.num2} = {currentProblem.answer}
                    </span>
                  </motion.div>
                  
                  <motion.div 
                    className="text-7xl mb-8"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, 0, -5, 0]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "loop"
                    }}
                  >
                    {currentProblem.emoji}
                  </motion.div>
                  
                  {/* Visual representation */}
                  <motion.div
                    className="bg-blue-50 p-6 rounded-lg border border-blue-200 w-full mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="font-bold text-blue-700 mb-4 text-center text-lg">Visual Representation</h3>
                    
                    {currentProblem.operation === 'addition' && (
                      <div className="flex flex-col space-y-4">
                        <div className="flex flex-wrap gap-2 justify-center">
                          {Array.from({ length: currentProblem.num1 }).map((_, idx) => (
                            <motion.div
                              key={`first-${idx}`}
                              className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: idx * 0.05 }}
                            >
                              {idx + 1}
                            </motion.div>
                          ))}
                        </div>
                        
                        <div className="flex justify-center">
                          <div className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold text-xl">+</div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 justify-center">
                          {Array.from({ length: currentProblem.num2 }).map((_, idx) => (
                            <motion.div
                              key={`second-${idx}`}
                              className="w-10 h-10 bg-green-400 rounded-lg flex items-center justify-center text-white font-bold"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.5 + idx * 0.05 }}
                            >
                              {idx + 1}
                            </motion.div>
                          ))}
                        </div>
                        
                        <div className="flex justify-center">
                          <div className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-xl">=</div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 justify-center">
                          {Array.from({ length: currentProblem.answer }).map((_, idx) => (
                            <motion.div
                              key={`result-${idx}`}
                              className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 1 + idx * 0.02 }}
                            >
                              {idx + 1}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {currentProblem.operation === 'subtraction' && (
                      <div className="flex flex-col space-y-4">
                        <div className="flex flex-wrap gap-2 justify-center">
                          {Array.from({ length: currentProblem.num1 }).map((_, idx) => (
                            <motion.div
                              key={`first-${idx}`}
                              className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center text-white font-bold"
                              initial={{ scale: 0 }}
                              animate={{ 
                                scale: 1,
                                backgroundColor: idx >= currentProblem.num1 - currentProblem.num2 ? 
                                  ['rgb(239, 68, 68)', 'rgb(239, 68, 68)', 'rgb(156, 163, 175)'] : 'rgb(239, 68, 68)'
                              }}
                              transition={{ 
                                delay: idx * 0.05,
                                backgroundColor: { delay: 1, duration: 1 }
                              }}
                            >
                              {idx + 1}
                            </motion.div>
                          ))}
                        </div>
                        
                        <div className="flex justify-center">
                          <div className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold text-xl">-</div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 justify-center">
                          {Array.from({ length: currentProblem.num2 }).map((_, idx) => (
                            <motion.div
                              key={`second-${idx}`}
                              className="w-10 h-10 bg-red-400 rounded-lg flex items-center justify-center text-white font-bold"
                              initial={{ scale: 0 }}
                              animate={{ 
                                scale: 1,
                                opacity: [1, 1, 0.3]
                              }}
                              transition={{ 
                                delay: 0.5 + idx * 0.05,
                                opacity: { delay: 1, duration: 1 }
                              }}
                            >
                              {idx + 1}
                            </motion.div>
                          ))}
                        </div>
                        
                        <div className="flex justify-center">
                          <div className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-xl">=</div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 justify-center">
                          {Array.from({ length: currentProblem.answer }).map((_, idx) => (
                            <motion.div
                              key={`result-${idx}`}
                              className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 1.5 + idx * 0.05 }}
                            >
                              {idx + 1}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {currentProblem.operation === 'multiplication' && (
                      <div className="flex flex-col space-y-4">
                        <div className="flex justify-center items-center space-x-4">
                          <div className="text-2xl font-bold text-yellow-700">{currentProblem.num1}</div>
                          <div className="px-4 py-2 bg-yellow-600 text-white rounded-lg font-bold text-xl">×</div>
                          <div className="text-2xl font-bold text-yellow-700">{currentProblem.num2}</div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          {Array.from({ length: currentProblem.num1 }).map((_, rowIdx) => (
                            <div key={`row-${rowIdx}`} className="flex flex-wrap gap-2 justify-center mb-2">
                              {Array.from({ length: currentProblem.num2 }).map((_, colIdx) => (
                                <motion.div
                                  key={`item-${rowIdx}-${colIdx}`}
                                  className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center text-white font-bold"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: 0.1 + (rowIdx * currentProblem.num2 + colIdx) * 0.02 }}
                                >
                                  {rowIdx + 1}×{colIdx + 1}
                                </motion.div>
                              ))}
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex justify-center">
                          <div className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-xl">=</div>
                        </div>
                        
                        <div className="flex justify-center">
                          <motion.div
                            className="px-6 py-3 bg-blue-500 rounded-lg text-white font-bold text-2xl"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 1 }}
                          >
                            {currentProblem.answer}
                          </motion.div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                  
                  {currentProblem.tip && (
                    <motion.p 
                      className="text-gray-700 text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <span className="font-bold">Tip:</span> {currentProblem.tip}
                    </motion.p>
                  )}
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="w-full">
                <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
                  Solve the math problem
                </h2>
                
                <div className="flex justify-center mb-8">
                  <div className="text-5xl font-bold text-center">
                    <span className={
                      currentProblem.operation === 'addition' ? 'text-green-600' :
                      currentProblem.operation === 'subtraction' ? 'text-red-600' :
                      'text-yellow-600'
                    }>
                      {currentProblem.num1} {getOperationSymbol(currentProblem.operation)} {currentProblem.num2} = ?
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col items-center mb-6">
                  <label htmlFor="answer" className="text-lg text-indigo-700 mb-2">Your Answer:</label>
                  <input
                    type="text"
                    id="answer"
                    value={userAnswer}
                    onChange={handleUserInput}
                    className="border-2 border-indigo-300 rounded-lg px-4 py-2 text-2xl text-center w-24 focus:outline-none focus:border-indigo-500"
                    placeholder="?"
                    maxLength={3}
                  />
                </div>
                
                <div className="flex justify-center">
                  <Button 
                    onClick={handleCheckAnswer}
                    className="bg-green-600 text-white px-8 py-2 text-xl"
                    disabled={!userAnswer}
                  >
                    Check Answer
                  </Button>
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
                          {currentProblem.num1} {getOperationSymbol(currentProblem.operation)} {currentProblem.num2} = {currentProblem.answer}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xl font-bold text-red-700 mb-2">Not quite right!</p>
                        <p className="text-red-600">
                          The correct answer is {currentProblem.answer}
                        </p>
                      </div>
                    )}
                    <Button 
                      onClick={handleNextProblem}
                      className="mt-4 bg-indigo-600 text-white"
                    >
                      Next Problem
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
              onClick={handlePrevProblem}
              disabled={currentProblemIndex === 0}
              className={`${currentProblemIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </Button>
            
            <div className="text-center">
              <span className="text-lg font-bold text-indigo-700">
                {currentProblemIndex + 1} of {filteredProblems.length}
              </span>
              <div className="flex mt-2 flex-wrap justify-center max-w-md">
                {filteredProblems.map((problem, index) => (
                  <div
                    key={problem.id}
                    className={`h-2 w-2 rounded-full mx-1 mb-1 ${
                      index === currentProblemIndex ? 'bg-indigo-600' : 
                      completedProblems.includes(problem.id) ? 'bg-green-400' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <Button 
              onClick={handleNextProblem}
              disabled={currentProblemIndex === filteredProblems.length - 1 && mode === 'learn'}
              className={`${currentProblemIndex === filteredProblems.length - 1 && mode === 'learn' ? 'opacity-50 cursor-not-allowed' : ''}`}
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
              You've completed all the math problems!
            </h3>
            <p className="text-indigo-600 mb-6">
              You're becoming a math wizard! Keep practicing to sharpen your skills.
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
                  setCurrentProblemIndex(0);
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

export default MathModule;
