import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './ui/Button';
import Card from './ui/Card';
import Modal from './ui/Modal';
import { useAudio } from '../hooks/useAudio';
import { useProgress } from '../context/ProgressContext';
import sentences from '../data/sentences';

const SentenceModule = ({ onBack }) => {
  const { playSound } = useAudio();
  const { updateProgress } = useProgress();
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [mode, setMode] = useState('learn'); // 'learn' or 'build'
  const [shuffledWords, setShuffledWords] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [completedSentences, setCompletedSentences] = useState([]);
  
  const currentSentence = sentences[currentSentenceIndex];
  
  // Shuffle the words of the current sentence for build mode
  useEffect(() => {
    if (mode === 'build') {
      // Split the sentence into words and shuffle them
      const words = currentSentence.sentence.split(' ');
      const shuffled = [...words];
      
      // Fisher-Yates shuffle algorithm
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      
      setShuffledWords(shuffled.map(word => ({ word, id: Math.random() })));
      setSelectedWords([]);
      setShowResult(false);
    }
  }, [currentSentenceIndex, mode, currentSentence]);
  
  // Update progress when a sentence is completed
  useEffect(() => {
    if (completedSentences.length > 0) {
      const progress = Math.floor((completedSentences.length / sentences.length) * 100);
      updateProgress('sentences', progress);
    }
  }, [completedSentences, updateProgress]);
  
  const handleNextSentence = () => {
    playSound('click');
    if (currentSentenceIndex < sentences.length - 1) {
      setCurrentSentenceIndex(prevIndex => prevIndex + 1);
    } else {
      // End of sentences reached
      setShowModal(true);
    }
    setMode('learn');
    setSelectedWords([]);
    setShowResult(false);
  };
  
  const handlePrevSentence = () => {
    playSound('click');
    if (currentSentenceIndex > 0) {
      setCurrentSentenceIndex(prevIndex => prevIndex - 1);
    }
    setMode('learn');
    setSelectedWords([]);
    setShowResult(false);
  };
  
  const handleBuildMode = () => {
    playSound('click');
    setMode('build');
  };
  
  const handleLearnMode = () => {
    playSound('click');
    setMode('learn');
  };
  
  const handleWordSelect = (wordObj) => {
    playSound('click');
    setSelectedWords([...selectedWords, wordObj]);
    setShuffledWords(shuffledWords.filter(w => w.id !== wordObj.id));
  };
  
  const handleWordRemove = (index) => {
    playSound('click');
    const removedWord = selectedWords[index];
    const newSelected = [...selectedWords];
    newSelected.splice(index, 1);
    setSelectedWords(newSelected);
    setShuffledWords([...shuffledWords, removedWord]);
  };
  
  const handleCheckSentence = () => {
    playSound('click');
    const builtSentence = selectedWords.map(w => w.word).join(' ');
    const correct = builtSentence === currentSentence.sentence;
    
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      playSound('correct');
      // Add to completed sentences if not already there
      if (!completedSentences.includes(currentSentenceIndex)) {
        setCompletedSentences(prev => [...prev, currentSentenceIndex]);
      }
    } else {
      playSound('incorrect');
    }
  };
  
  const handleReset = () => {
    playSound('click');
    // Move all selected words back to shuffled
    setShuffledWords([
      ...shuffledWords,
      ...selectedWords
    ]);
    setSelectedWords([]);
    setShowResult(false);
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
            <h1 className="text-2xl md:text-3xl font-bold text-indigo-700">Sentence Builder</h1>
            <p className="text-indigo-600">Learn to create simple sentences</p>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              onClick={handleLearnMode} 
              className={`${mode === 'learn' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'}`}
            >
              Learn
            </Button>
            <Button 
              onClick={handleBuildMode} 
              className={`${mode === 'build' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700'}`}
            >
              Build
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
                  key={currentSentenceIndex}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center w-full"
                >
                  <motion.div 
                    className="text-4xl font-bold text-indigo-600 mb-6 text-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    {currentSentence.sentence}
                  </motion.div>
                  
                  <motion.div 
                    className="text-7xl mb-6"
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
                    {currentSentence.emoji}
                  </motion.div>
                  
                  <motion.div
                    className="bg-purple-50 p-4 rounded-lg border border-purple-200 w-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="font-bold text-purple-700 mb-2">Words in this sentence:</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentSentence.sentence.split(' ').map((word, idx) => (
                        <motion.span
                          key={idx}
                          className="bg-white py-1 px-3 rounded-full shadow-sm border border-purple-200 text-purple-700"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5 + idx * 0.1 }}
                        >
                          {word}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                  
                  {currentSentence.description && (
                    <motion.p 
                      className="mt-6 text-center text-gray-700"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      {currentSentence.description}
                    </motion.p>
                  )}
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="w-full">
                <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
                  Build the sentence by arranging the words in order
                </h2>
                
                {/* Workspace for building sentence */}
                <div className="mb-8 min-h-[100px] bg-blue-50 rounded-lg p-4 border-2 border-dashed border-blue-300 flex flex-wrap gap-2 items-center">
                  {selectedWords.length === 0 ? (
                    <p className="text-blue-400 w-full text-center italic">Drag words here to build your sentence</p>
                  ) : (
                    selectedWords.map((wordObj, index) => (
                      <motion.div
                        key={wordObj.id}
                        className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md cursor-pointer text-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleWordRemove(index)}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        {wordObj.word}
                      </motion.div>
                    ))
                  )}
                </div>
                
                {/* Available words */}
                <div className="mb-6">
                  <h3 className="font-bold text-indigo-700 mb-3">Available Words:</h3>
                  <div className="flex flex-wrap gap-2">
                    {shuffledWords.map((wordObj) => (
                      <motion.div
                        key={wordObj.id}
                        className="bg-purple-500 text-white py-2 px-4 rounded-lg shadow-md cursor-pointer text-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleWordSelect(wordObj)}
                      >
                        {wordObj.word}
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                {/* Controls */}
                <div className="flex justify-center space-x-4">
                  <Button 
                    onClick={handleReset}
                    className="bg-gray-500 text-white"
                    disabled={selectedWords.length === 0}
                  >
                    Reset
                  </Button>
                  <Button 
                    onClick={handleCheckSentence}
                    className="bg-green-600 text-white"
                    disabled={selectedWords.length === 0 || selectedWords.length !== currentSentence.sentence.split(' ').length}
                  >
                    Check Sentence
                  </Button>
                </div>
                
                {/* Result feedback */}
                {showResult && (
                  <motion.div 
                    className={`mt-6 p-4 rounded-lg text-center ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {isCorrect ? (
                      <div>
                        <p className="text-xl font-bold text-green-700 mb-2">Perfect!</p>
                        <p className="text-green-600">
                          You built the sentence correctly: "{currentSentence.sentence}"
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xl font-bold text-red-700 mb-2">Not quite right!</p>
                        <p className="text-red-600">
                          The correct sentence is: "{currentSentence.sentence}"
                        </p>
                      </div>
                    )}
                    <Button 
                      onClick={handleNextSentence}
                      className="mt-4 bg-indigo-600 text-white"
                    >
                      Next Sentence
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
              onClick={handlePrevSentence}
              disabled={currentSentenceIndex === 0}
              className={`${currentSentenceIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </Button>
            
            <div className="text-center">
              <span className="text-lg font-bold text-indigo-700">
                {currentSentenceIndex + 1} of {sentences.length}
              </span>
              <div className="flex mt-2 flex-wrap justify-center max-w-md">
                {sentences.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full mx-1 mb-1 ${
                      index === currentSentenceIndex ? 'bg-indigo-600' : 
                      completedSentences.includes(index) ? 'bg-green-400' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <Button 
              onClick={handleNextSentence}
              disabled={currentSentenceIndex === sentences.length - 1 && mode === 'learn'}
              className={`${currentSentenceIndex === sentences.length - 1 && mode === 'learn' ? 'opacity-50 cursor-not-allowed' : ''}`}
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
              You've completed all the sentences!
            </h3>
            <p className="text-indigo-600 mb-6">
              You're now a sentence-building expert! Keep practicing to become even better.
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
                  setCurrentSentenceIndex(0);
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

export default SentenceModule;
