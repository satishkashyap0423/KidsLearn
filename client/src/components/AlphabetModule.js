import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Tone from 'tone';
import Button from './ui/Button';
import Card from './ui/Card';
import Modal from './ui/Modal';
import { useAudio } from '../hooks/useAudio';
import { useProgress } from '../context/ProgressContext';
import { useUser } from '../context/UserContext';
import alphabet from '../data/alphabet';

const AlphabetModule = ({ onBack }) => {
  const { playSound } = useAudio();
  const { updateProgress } = useProgress();
  const { user } = useUser();
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [mode, setMode] = useState('learn'); // 'learn' or 'quiz'
  const [quizOptions, setQuizOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [completedLetters, setCompletedLetters] = useState([]);
  
  const currentLetter = alphabet[currentLetterIndex];
  
  // Generate quiz options
  useEffect(() => {
    if (mode === 'quiz') {
      // Get the correct answer
      const correctAnswer = currentLetter;
      
      // Get 3 random wrong answers
      const wrongAnswers = [];
      while (wrongAnswers.length < 3) {
        const randomIndex = Math.floor(Math.random() * alphabet.length);
        if (randomIndex !== currentLetterIndex && !wrongAnswers.includes(alphabet[randomIndex])) {
          wrongAnswers.push(alphabet[randomIndex]);
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
  }, [currentLetterIndex, mode]);
  
  // Update progress when a letter is completed
  useEffect(() => {
    if (completedLetters.length > 0) {
      const progress = Math.floor((completedLetters.length / alphabet.length) * 100);
      updateProgress('alphabet', progress);
    }
  }, [completedLetters, updateProgress]);
  
  // Play letter sound when in learn mode - only when currentLetterIndex or mode changes
  useEffect(() => {
    if (mode === 'learn') {
      // Only play the sound when the letter changes or mode changes
      // Use the enhanced pronunciation (letter + word)
      playSound('letter', currentLetter.letter.toLowerCase(), { withWord: true });
    }
  }, [currentLetterIndex, mode, playSound]);
  
  const handleNextLetter = () => {
    playSound('click');
    if (currentLetterIndex < alphabet.length - 1) {
      setCurrentLetterIndex(prevIndex => prevIndex + 1);
    } else {
      // End of alphabet reached
      setShowModal(true);
    }
    setMode('learn');
    setShowResult(false);
    setSelectedOption(null);
  };
  
  const handlePrevLetter = () => {
    playSound('click');
    if (currentLetterIndex > 0) {
      setCurrentLetterIndex(prevIndex => prevIndex - 1);
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
    
    const correct = option.letter === currentLetter.letter;
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      playSound('correct');
      // Add to completed letters if not already there
      if (!completedLetters.includes(currentLetter.letter)) {
        setCompletedLetters(prev => [...prev, currentLetter.letter]);
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
            <h1 className="text-2xl md:text-3xl font-bold text-indigo-700">Alphabet Adventure</h1>
            <p className="text-indigo-600">Learn letters and their sounds</p>
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
                  key={currentLetter.letter}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center"
                >
                  <motion.div 
                    className="text-9xl font-bold text-indigo-600 mb-4 select-none cursor-pointer"
                    onClick={() => {
                      // To avoid audio initialization issues, check if Tone context is running
                      // and start it if needed (this requires user interaction)
                      if (!Tone.context || Tone.context.state !== 'running') {
                        console.log('Starting audio context on letter click...');
                        Tone.start().then(() => {
                          console.log('Audio context started, playing letter sound...');
                          playSound('letter', currentLetter.letter.toLowerCase(), { withWord: true });
                        }).catch(err => {
                          console.error('Failed to start audio context:', err);
                        });
                      } else {
                        // Play letter with word pronunciation (e.g., "A for Apple")
                        console.log('Audio context already running, playing letter sound directly');
                        playSound('letter', currentLetter.letter.toLowerCase(), { withWord: true });
                      }
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {currentLetter.letter}
                  </motion.div>
                  
                  <motion.div 
                    className="text-5xl mb-6"
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
                  >
                    {currentLetter.emoji}
                  </motion.div>
                  
                  <motion.p 
                    className="text-2xl text-indigo-700 font-semibold mb-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {currentLetter.word}
                  </motion.p>
                  
                  <motion.p 
                    className="text-gray-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {currentLetter.description}
                  </motion.p>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="w-full">
                <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
                  Which letter makes the sound for "{currentLetter.word}"?
                </h2>
                
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
                          {option.letter}
                        </span>
                        <span className="text-3xl">{option.emoji}</span>
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
                          {currentLetter.letter} is for {currentLetter.word}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xl font-bold text-red-700 mb-2">Not quite!</p>
                        <p className="text-red-600">
                          The correct answer is {currentLetter.letter} for {currentLetter.word}
                        </p>
                      </div>
                    )}
                    <Button 
                      onClick={handleNextLetter}
                      className="mt-4 bg-indigo-600 text-white"
                    >
                      Next Letter
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
              onClick={handlePrevLetter}
              disabled={currentLetterIndex === 0}
              className={`${currentLetterIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </Button>
            
            <div className="text-center">
              <span className="text-lg font-bold text-indigo-700">
                {currentLetterIndex + 1} of {alphabet.length}
              </span>
              <div className="flex mt-2">
                {alphabet.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full mx-1 ${
                      index === currentLetterIndex ? 'bg-indigo-600' : 
                      completedLetters.includes(alphabet[index].letter) ? 'bg-green-400' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <Button 
              onClick={handleNextLetter}
              disabled={currentLetterIndex === alphabet.length - 1 && mode === 'learn'}
              className={`${currentLetterIndex === alphabet.length - 1 && mode === 'learn' ? 'opacity-50 cursor-not-allowed' : ''}`}
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
              You've completed the Alphabet!
            </h3>
            <p className="text-indigo-600 mb-6">
              You've learned all 26 letters of the alphabet. Great job!
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
                  setCurrentLetterIndex(0);
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

export default AlphabetModule;
