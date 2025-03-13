import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from './ui/Button';
import Card from './ui/Card';
import { useUser } from '../context/UserContext';
import { useProgress } from '../context/ProgressContext';
import { useParentalControl } from '../context/ParentalControlContext';

const ParentalControl = ({ onClose }) => {
  const { user, setUser } = useUser();
  const { progress, resetProgress } = useProgress();
  const { settings, updateSettings } = useParentalControl();
  
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPinError, setShowPinError] = useState(false);
  const [activeTab, setActiveTab] = useState('general'); // 'general', 'accessibility', 'progress'
  const [tempSettings, setTempSettings] = useState({...settings});
  
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };
  
  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1 }
  };
  
  const handlePinChange = (e) => {
    // Only allow numbers and limit to 4 digits
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
    setPin(value);
    setShowPinError(false);
  };
  
  const handlePinSubmit = (e) => {
    e.preventDefault();
    // Simple PIN check - in real app this would be more secure
    if (pin === (settings.pin || '1234')) {
      setIsAuthenticated(true);
    } else {
      setShowPinError(true);
    }
  };
  
  const handleSettingsChange = (key, value) => {
    setTempSettings({...tempSettings, [key]: value});
  };
  
  const handleAgeGroupChange = (ageGroup) => {
    setUser({...user, ageGroup});
  };
  
  const handleSaveSettings = () => {
    updateSettings(tempSettings);
    onClose();
  };
  
  const handleResetProgress = () => {
    if (window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      resetProgress();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-xl shadow-xl overflow-hidden max-w-md w-full max-h-[90vh] overflow-y-auto"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        onClick={(e) => e.stopPropagation()}
      >
        {!isAuthenticated ? (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">Parental Controls</h2>
            <p className="text-center text-gray-600 mb-6">
              Please enter your 4-digit PIN to access parental controls.
            </p>
            
            <form onSubmit={handlePinSubmit}>
              <div className="mb-6">
                <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-1">PIN</label>
                <input
                  type="password"
                  id="pin"
                  value={pin}
                  onChange={handlePinChange}
                  className="w-full p-3 border border-gray-300 rounded-lg text-lg text-center focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter 4-digit PIN"
                  maxLength={4}
                />
                {showPinError && (
                  <p className="mt-2 text-sm text-red-600">Incorrect PIN. Please try again.</p>
                )}
                <p className="mt-2 text-xs text-gray-500">Default PIN is 1234 if you haven't changed it.</p>
              </div>
              
              <div className="flex justify-between">
                <Button 
                  type="button" 
                  onClick={onClose}
                  className="bg-gray-200 text-gray-800"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-indigo-600 text-white"
                  disabled={pin.length !== 4}
                >
                  Submit
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <div className="bg-indigo-600 py-4 px-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Parental Controls</h2>
                <button 
                  onClick={onClose}
                  className="text-white hover:text-indigo-100"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-1">
              <div className="flex border-b">
                <button
                  className={`flex-1 py-3 px-4 text-center font-medium ${activeTab === 'general' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab('general')}
                >
                  General
                </button>
                <button
                  className={`flex-1 py-3 px-4 text-center font-medium ${activeTab === 'accessibility' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab('accessibility')}
                >
                  Accessibility
                </button>
                <button
                  className={`flex-1 py-3 px-4 text-center font-medium ${activeTab === 'progress' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab('progress')}
                >
                  Progress
                </button>
              </div>
              
              <div className="p-4">
                {activeTab === 'general' && (
                  <div>
                    <h3 className="font-bold text-lg text-indigo-700 mb-4">General Settings</h3>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Child's Age Group
                      </label>
                      <div className="flex space-x-2">
                        <button
                          className={`flex-1 py-2 px-3 rounded-lg ${user.ageGroup === 'preStudents' ? 'bg-indigo-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                          onClick={() => handleAgeGroupChange('preStudents')}
                        >
                          Ages 3-5
                        </button>
                        <button
                          className={`flex-1 py-2 px-3 rounded-lg ${user.ageGroup === 'elementary' ? 'bg-indigo-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                          onClick={() => handleAgeGroupChange('elementary')}
                        >
                          Ages 6-8
                        </button>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="newPin" className="block text-sm font-medium text-gray-700 mb-2">
                        Change PIN
                      </label>
                      <input
                        type="password"
                        id="newPin"
                        value={tempSettings.pin || ''}
                        onChange={(e) => handleSettingsChange('pin', e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        placeholder="New 4-digit PIN"
                        maxLength={4}
                      />
                      <p className="text-xs text-gray-500 mt-1">Leave empty to keep current PIN</p>
                    </div>
                    
                    <div className="mb-6">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={tempSettings.allowSounds}
                          onChange={(e) => handleSettingsChange('allowSounds', e.target.checked)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-gray-700">Enable sounds</span>
                      </label>
                    </div>
                    
                    <div className="mb-6">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={tempSettings.allowAnimations}
                          onChange={(e) => handleSettingsChange('allowAnimations', e.target.checked)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-gray-700">Enable animations</span>
                      </label>
                    </div>
                  </div>
                )}
                
                {activeTab === 'accessibility' && (
                  <div>
                    <h3 className="font-bold text-lg text-indigo-700 mb-4">Accessibility Settings</h3>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Text Size
                      </label>
                      <div className="flex space-x-2">
                        <button
                          className={`flex-1 py-2 px-3 rounded-lg ${tempSettings.textSize === 'small' ? 'bg-indigo-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                          onClick={() => handleSettingsChange('textSize', 'small')}
                        >
                          Small
                        </button>
                        <button
                          className={`flex-1 py-2 px-3 rounded-lg ${tempSettings.textSize === 'medium' ? 'bg-indigo-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                          onClick={() => handleSettingsChange('textSize', 'medium')}
                        >
                          Medium
                        </button>
                        <button
                          className={`flex-1 py-2 px-3 rounded-lg ${tempSettings.textSize === 'large' ? 'bg-indigo-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                          onClick={() => handleSettingsChange('textSize', 'large')}
                        >
                          Large
                        </button>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={tempSettings.highContrast}
                          onChange={(e) => handleSettingsChange('highContrast', e.target.checked)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-gray-700">High contrast mode</span>
                      </label>
                    </div>
                    
                    <div className="mb-6">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={tempSettings.reducedMotion}
                          onChange={(e) => handleSettingsChange('reducedMotion', e.target.checked)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-gray-700">Reduced motion</span>
                      </label>
                    </div>
                  </div>
                )}
                
                {activeTab === 'progress' && (
                  <div>
                    <h3 className="font-bold text-lg text-indigo-700 mb-4">Progress Report</h3>
                    
                    <div className="space-y-4 mb-6">
                      <div>
                        <h4 className="font-medium text-indigo-600">Alphabet</h4>
                        <div className="w-full bg-gray-200 rounded-full h-4 mt-1">
                          <div 
                            className="bg-green-500 h-4 rounded-full" 
                            style={{ width: `${progress?.modules?.alphabet?.progress || 0}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {progress?.modules?.alphabet?.progress || 0}% complete
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-indigo-600">Counting</h4>
                        <div className="w-full bg-gray-200 rounded-full h-4 mt-1">
                          <div 
                            className="bg-green-500 h-4 rounded-full" 
                            style={{ width: `${progress?.modules?.counting?.progress || 0}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {progress?.modules?.counting?.progress || 0}% complete
                        </p>
                      </div>
                      
                      {user.ageGroup === 'elementary' && (
                        <>
                          <div>
                            <h4 className="font-medium text-indigo-600">Sentences</h4>
                            <div className="w-full bg-gray-200 rounded-full h-4 mt-1">
                              <div 
                                className="bg-green-500 h-4 rounded-full" 
                                style={{ width: `${progress?.modules?.sentences?.progress || 0}%` }}
                              ></div>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {progress?.modules?.sentences?.progress || 0}% complete
                            </p>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-indigo-600">Math</h4>
                            <div className="w-full bg-gray-200 rounded-full h-4 mt-1">
                              <div 
                                className="bg-green-500 h-4 rounded-full" 
                                style={{ width: `${progress?.modules?.math?.progress || 0}%` }}
                              ></div>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {progress?.modules?.math?.progress || 0}% complete
                            </p>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-indigo-600">Image Recognition</h4>
                            <div className="w-full bg-gray-200 rounded-full h-4 mt-1">
                              <div 
                                className="bg-green-500 h-4 rounded-full" 
                                style={{ width: `${progress?.modules?.images?.progress || 0}%` }}
                              ></div>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {progress?.modules?.images?.progress || 0}% complete
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-medium text-indigo-600 mb-2">Overall Progress</h4>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-6 mr-2">
                          <div 
                            className="bg-indigo-600 h-6 rounded-full text-white text-xs flex items-center justify-center" 
                            style={{ 
                              width: `${progress?.stars ? Math.min(100, progress.stars / 10) : 0}%` 
                            }}
                          >
                            {progress?.stars ? Math.floor(progress.stars / 10 * 100) : 0}%
                          </div>
                        </div>
                        <span className="text-indigo-600 font-bold">
                          {progress?.stars || 0} ⭐
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <Button 
                        onClick={handleResetProgress}
                        className="bg-red-600 text-white w-full"
                      >
                        Reset All Progress
                      </Button>
                      <p className="text-xs text-gray-500 mt-1 text-center">
                        Warning: This will reset all progress for all modules.
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="bg-gray-50 px-4 py-3 flex justify-end">
                <Button 
                  onClick={handleSaveSettings}
                  className="bg-indigo-600 text-white"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ParentalControl;
