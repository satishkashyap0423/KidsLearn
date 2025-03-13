import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const ParentalControlContext = createContext();

// Custom hook to use the parental control context
export const useParentalControl = () => {
  const context = useContext(ParentalControlContext);
  if (!context) {
    throw new Error('useParentalControl must be used within a ParentalControlProvider');
  }
  return context;
};

// Provider component
export const ParentalControlProvider = ({ children }) => {
  // Initial state for settings
  const [settings, setSettings] = useState(() => {
    // Try to get settings from localStorage
    const savedSettings = localStorage.getItem('kidlearn_parental_settings');
    return savedSettings ? JSON.parse(savedSettings) : {
      pin: '1234', // Default PIN
      allowSounds: true,
      allowAnimations: true,
      textSize: 'medium', // small, medium, large
      highContrast: false,
      reducedMotion: false,
      timeLimit: 0, // 0 means no limit, otherwise in minutes
      activeModules: ['alphabet', 'counting', 'sentences', 'math', 'images']
    };
  });

  // Save settings to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('kidlearn_parental_settings', JSON.stringify(settings));
  }, [settings]);

  // Function to update settings
  const updateSettings = (newSettings) => {
    setSettings({
      ...settings,
      ...newSettings
    });
  };

  // Function to check if a module is enabled
  const isModuleEnabled = (moduleName) => {
    return settings.activeModules.includes(moduleName);
  };

  // Function to toggle a module
  const toggleModule = (moduleName) => {
    setSettings(current => {
      const isEnabled = current.activeModules.includes(moduleName);
      
      return {
        ...current,
        activeModules: isEnabled
          ? current.activeModules.filter(name => name !== moduleName)
          : [...current.activeModules, moduleName]
      };
    });
  };

  // Value to be provided by the context
  const value = {
    settings,
    updateSettings,
    isModuleEnabled,
    toggleModule
  };

  return (
    <ParentalControlContext.Provider value={value}>
      {children}
    </ParentalControlContext.Provider>
  );
};
