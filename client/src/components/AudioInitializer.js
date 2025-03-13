import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';

const AudioInitializer = () => {
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [debugMessages, setDebugMessages] = useState([]);
  const [showDebug, setShowDebug] = useState(false);
  
  // Function to add debug messages
  const addDebugMessage = (message) => {
    console.log(message);
    setDebugMessages(prev => [...prev.slice(-4), message]);
  };

  // Check for audio context state changes
  useEffect(() => {
    const checkAudioContext = () => {
      try {
        if (Tone.context && Tone.context.state === 'running') {
          setAudioInitialized(true);
          addDebugMessage('Audio context is running');
        } else {
          if (Tone.context) {
            addDebugMessage(`Audio context state: ${Tone.context.state}. Click to enable.`);
          } else {
            addDebugMessage('Tone.js context not yet created');
          }
        }
      } catch (err) {
        addDebugMessage(`Error checking audio context: ${err.message}`);
      }
    };

    // Check initially
    checkAudioContext();

    // Set up a listener for audio context state changes
    const interval = setInterval(checkAudioContext, 2000);

    // Add document-wide listeners to help activate audio
    const activateAudio = async () => {
      if (Tone.context && Tone.context.state !== 'running') {
        try {
          await Tone.context.resume();
          addDebugMessage('Resumed audio context from document click');
        } catch (err) {
          addDebugMessage(`Failed to resume on document click: ${err.message}`);
        }
      }
    };
    
    document.addEventListener('click', activateAudio);
    document.addEventListener('touchstart', activateAudio);

    return () => {
      clearInterval(interval);
      document.removeEventListener('click', activateAudio);
      document.removeEventListener('touchstart', activateAudio);
    };
  }, []);

  const initializeAudio = async () => {
    try {
      addDebugMessage('Attempting to start audio context...');
      
      // Make sure Tone.js is ready
      if (!Tone.context) {
        addDebugMessage('Creating new Tone.js context');
      }
      
      await Tone.start();
      addDebugMessage('Audio context started successfully!');
      
      // Verify the context state after trying to start
      if (Tone.context.state === 'running') {
        setAudioInitialized(true);
        
        // Create a test sound to verify audio is working
        const synth = new Tone.Synth({
          oscillator: { type: 'sine' },
          envelope: {
            attack: 0.01,
            decay: 0.1,
            sustain: 0.5,
            release: 0.4
          }
        }).toDestination();
        
        // Play a simple C major chord sequence
        const now = Tone.now();
        synth.triggerAttackRelease("C4", "8n", now);
        synth.triggerAttackRelease("E4", "8n", now + 0.2);
        synth.triggerAttackRelease("G4", "8n", now + 0.4);
        
        addDebugMessage('Test sound played - audio working');
        
        // Create a global audio context resume function
        window._resumeAudio = async () => {
          try {
            await Tone.context.resume();
            console.log('Audio context resumed by global function');
            return true;
          } catch (err) {
            console.error('Failed to resume audio context:', err);
            return false;
          }
        };
      } else {
        addDebugMessage(`Audio context state after start: ${Tone.context.state}`);
      }
    } catch (error) {
      addDebugMessage(`Failed to start audio context: ${error.message}`);
      console.error('Failed to start audio context:', error);
    }
  };

  // Always show the prompt until audio is initialized
  if (!audioInitialized) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md text-center">
          <h2 className="text-2xl font-bold text-indigo-700 mb-4">Enable Audio</h2>
          <p className="text-gray-700 mb-6">
            To hear sounds and pronunciations in KidLearn, we need your permission to play audio.
            Please click the button below to enable audio features.
          </p>
          <div className="mb-4">
            <button
              onClick={initializeAudio}
              className="bg-indigo-600 text-white py-3 px-8 rounded-lg text-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors"
            >
              Enable Audio
            </button>
          </div>
          
          {/* Show debug information */}
          <div className="mt-4 border-t pt-4">
            <button 
              onClick={() => setShowDebug(!showDebug)}
              className="text-xs text-gray-500 underline mb-2"
            >
              {showDebug ? 'Hide Debug Info' : 'Show Debug Info'}
            </button>
            
            {showDebug && (
              <div className="text-left bg-gray-100 p-2 rounded text-xs font-mono">
                <p className="font-bold mb-1">Audio Status:</p>
                {debugMessages.length > 0 ? (
                  <ul>
                    {debugMessages.map((msg, i) => (
                      <li key={i} className="text-gray-700">{msg}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No debug information available</p>
                )}
                
                <div className="mt-2">
                  <p className="font-bold mb-1">Manual Audio Test:</p>
                  <button
                    onClick={() => {
                      try {
                        const synth = new Tone.Synth().toDestination();
                        synth.triggerAttackRelease("C4", "8n");
                        addDebugMessage("Manual test sound played");
                      } catch (err) {
                        addDebugMessage(`Test failed: ${err.message}`);
                      }
                    }}
                    className="bg-gray-200 px-2 py-1 rounded text-xs"
                  >
                    Play Test Sound
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <p className="text-sm text-gray-500 italic mt-2">
            Note: You may need to click this button each time you reload the app
          </p>
        </div>
      </div>
    );
  }

  // If audio is initialized, render a small indicator that can be clicked to re-initialize if needed
  return (
    <div 
      className="fixed bottom-4 right-4 bg-indigo-600 text-white p-2 rounded-full shadow-lg cursor-pointer z-50"
      onClick={() => {
        setAudioInitialized(false);
      }}
      title="Audio enabled. Click to reinitialize if sounds stop working."
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
      </svg>
    </div>
  );
};

export default AudioInitializer;