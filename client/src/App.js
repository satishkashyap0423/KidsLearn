import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from './components/Layout';
import HomePage from './components/HomePage';
import AgeSelection from './components/AgeSelection';
import PreStudentsDashboard from './components/PreStudentsDashboard';
import ElementaryDashboard from './components/ElementaryDashboard';
import AlphabetModule from './components/AlphabetModule';
import CountingModule from './components/CountingModule';
import SentenceModule from './components/SentenceModule';
import MathModule from './components/MathModule';
import ImageRecognitionModule from './components/ImageRecognitionModule';
import ParentalControl from './components/ParentalControl';
import AudioInitializer from './components/AudioInitializer';
import { useUser } from './context/UserContext';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentModule, setCurrentModule] = useState(null);
  const { user } = useUser();
  const [isParentalControlVisible, setIsParentalControlVisible] = useState(false);

  // Handle navigation
  const navigate = (page, module = null) => {
    setCurrentPage(page);
    if (module) setCurrentModule(module);
  };

  // Toggle parental control overlay
  const toggleParentalControl = () => {
    setIsParentalControlVisible(!isParentalControlVisible);
  };

  // Animation variants for page transitions
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <React.Fragment>
      <AudioInitializer />
      <Layout 
        onShowParentalControl={toggleParentalControl} 
        onNavigateHome={() => navigate('home')}
      >
        <motion.div
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          transition={{ duration: 0.5 }}
          className="w-full h-full"
        >
          {currentPage === 'home' && (
            <HomePage onStartClick={() => navigate('ageSelection')} />
          )}
          
          {currentPage === 'ageSelection' && (
            <AgeSelection 
              onSelectAge={(ageGroup) => {
                if (ageGroup === 'preStudents') {
                  navigate('preStudentsDashboard');
                } else {
                  navigate('elementaryDashboard');
                }
              }} 
            />
          )}
          
          {currentPage === 'preStudentsDashboard' && (
            <PreStudentsDashboard 
              onModuleSelect={(module) => navigate('module', module)} 
            />
          )}
          
          {currentPage === 'elementaryDashboard' && (
            <ElementaryDashboard 
              onModuleSelect={(module) => navigate('module', module)} 
            />
          )}
          
          {currentPage === 'module' && currentModule === 'alphabet' && (
            <AlphabetModule onBack={() => navigate(user.ageGroup === 'preStudents' ? 'preStudentsDashboard' : 'elementaryDashboard')} />
          )}
          
          {currentPage === 'module' && currentModule === 'counting' && (
            <CountingModule onBack={() => navigate(user.ageGroup === 'preStudents' ? 'preStudentsDashboard' : 'elementaryDashboard')} />
          )}
          
          {currentPage === 'module' && currentModule === 'sentences' && (
            <SentenceModule onBack={() => navigate('elementaryDashboard')} />
          )}
          
          {currentPage === 'module' && currentModule === 'math' && (
            <MathModule onBack={() => navigate('elementaryDashboard')} />
          )}
          
          {currentPage === 'module' && currentModule === 'images' && (
            <ImageRecognitionModule onBack={() => navigate('elementaryDashboard')} />
          )}
        </motion.div>
        
        {isParentalControlVisible && (
          <ParentalControl onClose={toggleParentalControl} />
        )}
      </Layout>
    </React.Fragment>
  );
};

export default App;