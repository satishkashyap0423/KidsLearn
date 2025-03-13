import { useState, useEffect, useCallback } from 'react';
import * as Tone from 'tone';
import { useParentalControl } from '../context/ParentalControlContext';
import { playSound as playSoundUtil } from '../utils/audio';

// Export as named export to match import statements in components
export const useAudio = () => {
  const { settings } = useParentalControl();
  const soundsEnabled = settings.allowSounds;
  const [audioReady, setAudioReady] = useState(false);
  
  // Initialize Tone.js
  useEffect(() => {
    // Only start Tone.js if sounds are enabled
    if (soundsEnabled) {
      // Make sure we start audio on user interaction
      const handleFirstInteraction = async () => {
        try {
          if (Tone.context.state !== 'running') {
            console.log('Starting Tone.js audio context...');
            await Tone.start();
            console.log('Tone.js audio context started successfully');
            setAudioReady(true);
          } else {
            setAudioReady(true);
          }
          document.removeEventListener('click', handleFirstInteraction);
          document.removeEventListener('touchstart', handleFirstInteraction);
        } catch (error) {
          console.error('Error starting Tone.js:', error);
        }
      };

      // Try to start the audio context immediately if it's already allowed by the browser
      const attemptAutoStart = async () => {
        try {
          if (Tone.context.state === 'running') {
            setAudioReady(true);
          } else {
            // We'll need user interaction
            document.addEventListener('click', handleFirstInteraction);
            document.addEventListener('touchstart', handleFirstInteraction);
          }
        } catch (error) {
          console.error('Error checking Tone.js state:', error);
        }
      };
      
      attemptAutoStart();

      return () => {
        document.removeEventListener('click', handleFirstInteraction);
        document.removeEventListener('touchstart', handleFirstInteraction);
      };
    }
  }, [soundsEnabled]);

  // Play sound function
  const playSound = useCallback((soundType, soundId = '', options = {}) => {
    if (!soundsEnabled || !audioReady) {
      // Skip if sound is disabled or audio context isn't ready
      if (!soundsEnabled) {
        console.log('Sounds are disabled in settings');
      } else if (!audioReady) {
        console.log('Audio context not yet ready. Click somewhere on the page to enable audio.');
      }
      return;
    }
    
    // Wrap in try/catch to prevent app crashes
    try {
      playSoundUtil(soundType, soundId, options);
    } catch (error) {
      console.error('Error in playSound:', error);
    }
  }, [soundsEnabled, audioReady]);
  
  // Play success sound
  const playSuccessSound = useCallback(() => {
    if (!soundsEnabled || !audioReady) return;
    
    try {
      playSoundUtil('correct');
    } catch (error) {
      console.error('Error in playSuccessSound:', error);
    }
  }, [soundsEnabled, audioReady]);
  
  // Play error sound
  const playErrorSound = useCallback(() => {
    if (!soundsEnabled || !audioReady) return;
    
    try {
      playSoundUtil('incorrect');
    } catch (error) {
      console.error('Error in playErrorSound:', error);
    }
  }, [soundsEnabled, audioReady]);

  return {
    playSound,
    playSuccessSound,
    playErrorSound,
    audioReady
  };
};

// Also export as default to maintain backward compatibility
export default useAudio;
