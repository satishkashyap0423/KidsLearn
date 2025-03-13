import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './ui/Button';
import Card from './ui/Card';
import Modal from './ui/Modal';
import { useAudio } from '../hooks/useAudio';
import { useProgress } from '../context/ProgressContext';
import { useUser } from '../context/UserContext';
import images from '../data/images';

const ImageRecognitionModule = ({ onBack }) => {
  const { playSound } = useAudio();
  const { updateProgress } = useProgress();
  const { user } = useUser();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mode, setMode] = useState('learn'); // 'learn' or 'identify'
  const [optionsForQuestion, setOptionsForQuestion] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [completedImages, setCompletedImages] = useState([]);
  
  const currentImage = images[currentImageIndex];
  
  // Generate options for identification mode
  useEffect(() => {
    if (mode === 'identify') {
      // Get the correct answer
      const correctAnswer = currentImage;
      
      // Get 3 random wrong answers
      const wrongAnswers = [];
      while (wrongAnswers.length < 3) {
        const randomIndex = Math.floor(Math.random() * images.length);
        if (randomIndex !== currentImageIndex && !wrongAnswers.includes(images[randomIndex])) {
          wrongAnswers.push(images[randomIndex]);
        }
      }
      
      // Combine and shuffle
      const options = [correctAnswer, ...wrongAnswers];
      for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
      }
      
      setOptionsForQuestion(options);
    }
  }, [currentImageIndex, mode]);
  
  // Update progress when an image is completed
  useEffect(() => {
    if (completedImages.length > 0) {
      const progress = Math.floor((completedImages.length / images.length) * 100);
      updateProgress('images', progress);
    }
  }, [completedImages, updateProgress]);
  
  const handleNextImage = () => {
    playSound('click');
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(prevIndex => prevIndex + 1);
    } else {
      // End of images reached
      setShowModal(true);
    }
    setMode('learn');
    setShowResult(false);
    setSelectedOption(null);
  };
  
  const handlePrevImage = () => {
    playSound('click');
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prevIndex => prevIndex - 1);
    }
    setMode('learn');
    setShowResult(false);
    setSelectedOption(null);
  };
  
  const handleIdentifyMode = () => {
    playSound('click');
    setMode('identify');
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
    
    const correct = option.id === currentImage.id;
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      playSound('correct');
      // Add to completed images if not already there
      if (!completedImages.includes(currentImage.id)) {
        setCompletedImages(prev => [...prev, currentImage.id]);
      }
    } else {
      playSound('incorrect');
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
            <h1 className="text-2xl md:text-3xl font-bold text-indigo-700">Image Recognition</h1>
            <p className="text-indigo-600">Learn to identify objects and animals</p>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              onClick={handleLearnMode} 
              className={`${mode === 'learn' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'}`}
            >
              Learn
            </Button>
            <Button 
              onClick={handleIdentifyMode} 
              className={`${mode === 'identify' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700'}`}
            >
              Identify
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
                  key={currentImage.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center w-full"
                >
                  <motion.div 
                    className="text-3xl font-bold text-indigo-700 mb-4 text-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    {currentImage.name}
                  </motion.div>
                  
                  <motion.div 
                    className="text-8xl mb-6"
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
                    {currentImage.emoji}
                  </motion.div>
                  
                  <motion.div
                    className="bg-purple-50 p-5 rounded-lg border border-purple-200 w-full mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="font-bold text-purple-700 mb-2">What is this?</h3>
                    <div className="flex justify-between">
                      <div>
                        <p className="text-xl text-purple-800 font-semibold">{currentImage.name}</p>
                        <p className="text-purple-600 italic">({currentImage.phonetic})</p>
                      </div>
                      <div className="flex items-center">
                        <motion.button
                          className="bg-purple-600 text-white p-2 rounded-full"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => playSound('word', currentImage.id)}
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                          </svg>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="text-gray-700 mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <h3 className="font-bold text-indigo-700 mb-2">Facts:</h3>
                    <ul className="list-disc list-inside">
                      {currentImage.facts.map((fact, index) => (
                        <motion.li 
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + index * 0.2 }}
                          className="mb-1"
                        >
                          {fact}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                  
                  {currentImage.category && (
                    <motion.p 
                      className="bg-indigo-100 px-4 py-2 rounded-full text-indigo-700"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2 }}
                    >
                      Category: {currentImage.category}
                    </motion.p>
                  )}
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="w-full">
                <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
                  What is this?
                </h2>
                
                <motion.div 
                  className="text-9xl mb-8 flex justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 10 }}
                >
                  {currentImage.emoji}
                </motion.div>
                
                <div className="grid grid-cols-2 gap-4">
                  {optionsForQuestion.map((option, index) => (
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
                        <span className="text-xl font-bold text-indigo-700 mb-2">
                          {option.name}
                        </span>
                        <span className="text-5xl">{option.emoji}</span>
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
                          That is a {currentImage.name}!
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xl font-bold text-red-700 mb-2">Not quite!</p>
                        <p className="text-red-600">
                          The correct answer is {currentImage.name}
                        </p>
                      </div>
                    )}
                    <Button 
                      onClick={handleNextImage}
                      className="mt-4 bg-indigo-600 text-white"
                    >
                      Next Image
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
              onClick={handlePrevImage}
              disabled={currentImageIndex === 0}
              className={`${currentImageIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </Button>
            
            <div className="text-center">
              <span className="text-lg font-bold text-indigo-700">
                {currentImageIndex + 1} of {images.length}
              </span>
              <div className="flex mt-2 flex-wrap justify-center max-w-md">
                {images.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full mx-1 mb-1 ${
                      index === currentImageIndex ? 'bg-indigo-600' : 
                      completedImages.includes(images[index].id) ? 'bg-green-400' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <Button 
              onClick={handleNextImage}
              disabled={currentImageIndex === images.length - 1 && mode === 'learn'}
              className={`${currentImageIndex === images.length - 1 && mode === 'learn' ? 'opacity-50 cursor-not-allowed' : ''}`}
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
              You've completed Image Recognition!
            </h3>
            <p className="text-indigo-600 mb-6">
              You can now identify many different things! Amazing job!
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
                  setCurrentImageIndex(0);
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

export default ImageRecognitionModule;
