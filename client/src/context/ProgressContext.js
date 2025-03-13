import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './UserContext';

// Create the context
const ProgressContext = createContext();

// Custom hook to use the progress context
export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

// Provider component
export const ProgressProvider = ({ children }) => {
  const { user } = useUser();
  
  // Initial state for progress
  const [progress, setProgress] = useState(() => {
    // Try to get progress from localStorage
    const savedProgress = localStorage.getItem('kidlearn_progress');
    return savedProgress ? JSON.parse(savedProgress) : {
      stars: 0,
      modules: {
        alphabet: { progress: 0, completed: false },
        counting: { progress: 0, completed: false },
        sentences: { progress: 0, completed: false },
        math: { progress: 0, completed: false },
        images: { progress: 0, completed: false }
      }
    };
  });

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('kidlearn_progress', JSON.stringify(progress));
  }, [progress]);

  // Function to update module progress
  const updateProgress = (module, progressValue) => {
    setProgress(currentProgress => {
      // Get current module data
      const currentModuleData = currentProgress.modules[module] || { progress: 0, completed: false };
      
      // Calculate stars to award based on progress increase
      let starsToAdd = 0;
      if (progressValue > currentModuleData.progress) {
        // Award stars proportional to progress increase
        // For every 10% increase, award 1 star
        starsToAdd = Math.floor((progressValue - currentModuleData.progress) / 10);
      }
      
      // Check if module is now completed
      const isCompleted = progressValue >= 100;
      
      // Award bonus stars for completion
      if (isCompleted && !currentModuleData.completed) {
        starsToAdd += 5; // Bonus for completing a module
      }
      
      return {
        ...currentProgress,
        stars: currentProgress.stars + starsToAdd,
        modules: {
          ...currentProgress.modules,
          [module]: {
            progress: progressValue,
            completed: isCompleted
          }
        }
      };
    });
  };

  // Function to reset all progress
  const resetProgress = () => {
    const freshProgress = {
      stars: 0,
      modules: {
        alphabet: { progress: 0, completed: false },
        counting: { progress: 0, completed: false },
        sentences: { progress: 0, completed: false },
        math: { progress: 0, completed: false },
        images: { progress: 0, completed: false }
      }
    };
    
    setProgress(freshProgress);
    localStorage.setItem('kidlearn_progress', JSON.stringify(freshProgress));
  };

  // Value to be provided by the context
  const value = {
    progress,
    updateProgress,
    resetProgress
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};
