import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from './ui/Button';
import { useUser } from '../context/UserContext';
import { useProgress } from '../context/ProgressContext';
import RewardsDisplay from './RewardsDisplay';

const Layout = ({ children, onShowParentalControl, onNavigateHome }) => {
  const { user } = useUser();
  const { progress } = useProgress();
  const [showMenu, setShowMenu] = useState(false);
  
  // Secret code sequence for parental controls (click footer 4 times rapidly)
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  const handleFooterClick = () => {
    const now = new Date().getTime();
    
    if (now - lastClickTime < 500) {
      // Clicks are happening fast enough
      setClickCount(prev => prev + 1);
      if (clickCount >= 3) {
        // After 4 rapid clicks (0, 1, 2, 3)
        setClickCount(0);
        onShowParentalControl();
      }
    } else {
      // Too slow, reset the count
      setClickCount(1);
    }
    
    setLastClickTime(now);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-100 to-purple-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 p-4 shadow-lg relative z-10">
        <div className="container mx-auto flex justify-between items-center">
          <motion.div 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onNavigateHome}
            className="flex items-center cursor-pointer"
          >
            <motion.svg 
              className="w-10 h-10 mr-2 text-indigo-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2, repeatType: "loop" }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </motion.svg>
            <h1 className="text-2xl font-bold text-indigo-700">KidLearn</h1>
          </motion.div>
          
          {user && (
            <div className="flex items-center">
              <RewardsDisplay count={progress?.stars || 0} />
              <Button 
                onClick={() => setShowMenu(!showMenu)}
                className="ml-4 bg-yellow-400 text-indigo-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
            </div>
          )}
        </div>
        
        {/* Mobile Menu */}
        {showMenu && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="absolute top-full left-0 right-0 bg-yellow-100 shadow-lg rounded-b-lg overflow-hidden z-20"
          >
            <div className="p-4 flex flex-col space-y-2">
              <Button onClick={onNavigateHome} className="w-full justify-center">
                Home
              </Button>
              <Button onClick={() => { setShowMenu(false); onNavigateHome(); }} className="w-full justify-center">
                Change Age Group
              </Button>
            </div>
          </motion.div>
        )}
      </header>
      
      {/* Main Content */}
      <main className="flex-1 container mx-auto p-4 md:p-6">
        {children}
      </main>
      
      {/* Footer */}
      <footer 
        onClick={handleFooterClick}
        className="bg-indigo-600 text-white p-3 text-center text-sm"
      >
        <p>© 2023 KidLearn - Fun Educational App for Kids</p>
      </footer>
    </div>
  );
};

export default Layout;
