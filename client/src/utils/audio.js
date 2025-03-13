import * as Tone from 'tone';

// Synth for generating tones
let synth;
let synth2; // Second synth for overlapping sounds

// Initialize synth
const initSynth = () => {
  try {
    // First check if audio context is running
    if (Tone.context.state !== 'running') {
      console.log('Audio context not yet ready. Click somewhere on the page to enable audio.');
      return null;
    }
    
    // Initialize synth if not already done
    if (!synth) {
      synth = new Tone.Synth({
        oscillator: {
          type: 'sine'
        },
        envelope: {
          attack: 0.01,
          decay: 0.1,
          sustain: 0.3,
          release: 0.5
        }
      }).toDestination();
    }
    return synth;
  } catch (error) {
    console.error('Error initializing synth:', error);
    return null; // Return null if we couldn't create the synth
  }
};

// Initialize second synth for concurrent sounds (used in pronunciation)
const initSynth2 = () => {
  try {
    // First check if audio context is running
    if (Tone.context.state !== 'running') {
      console.log('Audio context not yet ready for synth2.');
      return null;
    }
    
    // Initialize synth if not already done
    if (!synth2) {
      synth2 = new Tone.Synth({
        oscillator: {
          type: 'triangle'
        },
        envelope: {
          attack: 0.02,
          decay: 0.2,
          sustain: 0.2,
          release: 0.4
        }
      }).toDestination();
    }
    return synth2;
  } catch (error) {
    console.error('Error initializing synth2:', error);
    return null;
  }
};

// Play a tone with the given frequency and duration
const playTone = (frequency, duration = 0.3) => {
  try {
    const s = initSynth();
    if (s) {
      s.triggerAttackRelease(frequency, duration);
    } else {
      console.warn('Cannot play tone: synth not initialized');
    }
  } catch (error) {
    console.error('Error playing tone:', error);
  }
};

// Sound effects for different actions
const soundEffects = {
  click: () => {
    playTone('C5', 0.1);
  },
  correct: () => {
    try {
      // Play a happy little melody
      const s = initSynth();
      if (!s) return;
      
      const now = Tone.now();
      s.triggerAttackRelease('C5', '8n', now);
      s.triggerAttackRelease('E5', '8n', now + 0.1);
      s.triggerAttackRelease('G5', '8n', now + 0.2);
      s.triggerAttackRelease('C6', '4n', now + 0.3);
    } catch (error) {
      console.error('Error playing correct sound:', error);
    }
  },
  incorrect: () => {
    try {
      // Play a sad little melody
      const s = initSynth();
      if (!s) return;
      
      const now = Tone.now();
      s.triggerAttackRelease('E4', '8n', now);
      s.triggerAttackRelease('C4', '4n', now + 0.2);
    } catch (error) {
      console.error('Error playing incorrect sound:', error);
    }
  },
  welcome: () => {
    try {
      // Play a welcoming melody
      const s = initSynth();
      if (!s) return;
      
      const now = Tone.now();
      s.triggerAttackRelease('G4', '8n', now);
      s.triggerAttackRelease('C5', '8n', now + 0.2);
      s.triggerAttackRelease('E5', '8n', now + 0.4);
      s.triggerAttackRelease('G5', '4n', now + 0.6);
    } catch (error) {
      console.error('Error playing welcome sound:', error);
    }
  },
  dashboard: () => {
    try {
      // Simple chime for dashboard
      const s = initSynth();
      if (!s) return;
      
      const now = Tone.now();
      s.triggerAttackRelease('E5', '8n', now);
      s.triggerAttackRelease('G5', '8n', now + 0.1);
    } catch (error) {
      console.error('Error playing dashboard sound:', error);
    }
  },
  complete: () => {
    try {
      // Completion fanfare
      const s = initSynth();
      if (!s) return;
      
      const now = Tone.now();
      s.triggerAttackRelease('C5', '8n', now);
      s.triggerAttackRelease('E5', '8n', now + 0.1);
      s.triggerAttackRelease('G5', '8n', now + 0.2);
      s.triggerAttackRelease('C6', '4n', now + 0.3);
      s.triggerAttackRelease('G5', '8n', now + 0.6);
      s.triggerAttackRelease('C6', '2n', now + 0.7);
    } catch (error) {
      console.error('Error playing complete sound:', error);
    }
  }
};

// Sound libraries for letter and number sounds
const letterSounds = {
  a: () => playTone('C4', 0.3),
  b: () => playTone('D4', 0.3),
  c: () => playTone('E4', 0.3),
  d: () => playTone('F4', 0.3),
  e: () => playTone('G4', 0.3),
  f: () => playTone('A4', 0.3),
  g: () => playTone('B4', 0.3),
  h: () => playTone('C5', 0.3),
  i: () => playTone('D5', 0.3),
  j: () => playTone('E5', 0.3),
  k: () => playTone('F5', 0.3),
  l: () => playTone('G5', 0.3),
  m: () => playTone('A5', 0.3),
  n: () => playTone('B5', 0.3),
  o: () => playTone('C6', 0.3),
  p: () => playTone('D6', 0.3),
  q: () => playTone('E6', 0.3),
  r: () => playTone('F6', 0.3),
  s: () => playTone('G6', 0.3),
  t: () => playTone('A6', 0.3),
  u: () => playTone('B6', 0.3),
  v: () => playTone('C7', 0.3),
  w: () => playTone('D7', 0.3),
  x: () => playTone('E7', 0.3),
  y: () => playTone('F7', 0.3),
  z: () => playTone('G7', 0.3)
};

const numberSounds = {
  '1': () => playTone('C4', 0.3),
  '2': () => playTone('D4', 0.3),
  '3': () => playTone('E4', 0.3),
  '4': () => playTone('F4', 0.3),
  '5': () => playTone('G4', 0.3),
  '6': () => playTone('A4', 0.3),
  '7': () => playTone('B4', 0.3),
  '8': () => playTone('C5', 0.3),
  '9': () => playTone('D5', 0.3),
  '10': () => playTone('E5', 0.3),
  '11': () => playTone('F5', 0.3),
  '12': () => playTone('G5', 0.3),
  '13': () => playTone('A5', 0.3),
  '14': () => playTone('B5', 0.3),
  '15': () => playTone('C6', 0.3),
  '16': () => playTone('D6', 0.3),
  '17': () => playTone('E6', 0.3),
  '18': () => playTone('F6', 0.3),
  '19': () => playTone('G6', 0.3),
  '20': () => playTone('A6', 0.3)
};

// Word sounds for image recognition and alphabets
const wordSounds = {
  // Alphabet words
  'apple': () => {
    try {
      const s = initSynth();
      if (!s) return;
      
      const now = Tone.now();
      s.triggerAttackRelease('C4', '8n', now);
      s.triggerAttackRelease('E4', '8n', now + 0.2);
      s.triggerAttackRelease('G4', '8n', now + 0.4);
    } catch (error) {
      console.error('Error playing apple sound:', error);
    }
  },
  'ball': () => {
    try {
      const s = initSynth();
      if (!s) return;
      
      const now = Tone.now();
      s.triggerAttackRelease('D4', '8n', now);
      s.triggerAttackRelease('F4', '8n', now + 0.2);
      s.triggerAttackRelease('A4', '8n', now + 0.4);
    } catch (error) {
      console.error('Error playing ball sound:', error);
    }
  },
  'cat': () => {
    try {
      const s = initSynth();
      if (!s) return;
      
      const now = Tone.now();
      s.triggerAttackRelease('E4', '8n', now);
      s.triggerAttackRelease('G4', '8n', now + 0.2);
      s.triggerAttackRelease('B4', '8n', now + 0.4);
    } catch (error) {
      console.error('Error playing cat sound:', error);
    }
  },
  'dog': () => {
    try {
      const s = initSynth();
      if (!s) return;
      
      const now = Tone.now();
      s.triggerAttackRelease('F4', '8n', now);
      s.triggerAttackRelease('A4', '8n', now + 0.2);
      s.triggerAttackRelease('C5', '8n', now + 0.4);
    } catch (error) {
      console.error('Error playing dog sound:', error);
    }
  },
  'elephant': () => {
    try {
      const s = initSynth();
      if (!s) return;
      
      const now = Tone.now();
      s.triggerAttackRelease('G4', '8n', now);
      s.triggerAttackRelease('B4', '8n', now + 0.2);
      s.triggerAttackRelease('D5', '8n', now + 0.4);
    } catch (error) {
      console.error('Error playing elephant sound:', error);
    }
  },
  'fish': () => {
    try {
      const s = initSynth();
      if (!s) return;
      
      const now = Tone.now();
      s.triggerAttackRelease('A4', '8n', now);
      s.triggerAttackRelease('C5', '8n', now + 0.2);
      s.triggerAttackRelease('E5', '8n', now + 0.4);
    } catch (error) {
      console.error('Error playing fish sound:', error);
    }
  },
  'goat': () => {
    try {
      const s = initSynth();
      if (!s) return;
      
      const now = Tone.now();
      s.triggerAttackRelease('B4', '8n', now);
      s.triggerAttackRelease('D5', '8n', now + 0.2);
      s.triggerAttackRelease('F5', '8n', now + 0.4);
    } catch (error) {
      console.error('Error playing goat sound:', error);
    }
  },
  'house': () => {
    try {
      const s = initSynth();
      if (!s) return;
      
      const now = Tone.now();
      s.triggerAttackRelease('C5', '8n', now);
      s.triggerAttackRelease('E5', '8n', now + 0.2);
      s.triggerAttackRelease('G5', '8n', now + 0.4);
    } catch (error) {
      console.error('Error playing house sound:', error);
    }
  },
  'ice cream': () => {
    try {
      const s = initSynth();
      if (!s) return;
      
      const now = Tone.now();
      s.triggerAttackRelease('D5', '8n', now);
      s.triggerAttackRelease('F5', '8n', now + 0.2);
      s.triggerAttackRelease('A5', '8n', now + 0.4);
    } catch (error) {
      console.error('Error playing ice cream sound:', error);
    }
  },
  // More words can be added as needed
  'banana': () => {
    try {
      const s = initSynth();
      if (!s) return;
      
      const now = Tone.now();
      s.triggerAttackRelease('E5', '8n', now);
      s.triggerAttackRelease('C5', '8n', now + 0.2);
      s.triggerAttackRelease('G5', '8n', now + 0.4);
    } catch (error) {
      console.error('Error playing banana sound:', error);
    }
  }
};

// Letter-word combinations for enhanced pronunciation
const letterWordCombinations = {
  // Format: { letter: 'word' }
  'a': 'apple',
  'b': 'ball',
  'c': 'cat',
  'd': 'dog',
  'e': 'elephant',
  'f': 'fish',
  'g': 'goat',
  'h': 'house',
  'i': 'ice cream',
  'j': 'jacket',
  'k': 'kite',
  'l': 'lion',
  'm': 'monkey',
  'n': 'nest',
  'o': 'orange',
  'p': 'penguin',
  'q': 'queen',
  'r': 'rabbit',
  's': 'snake',
  't': 'tiger',
  'u': 'umbrella',
  'v': 'volcano',
  'w': 'whale',
  'x': 'xylophone',
  'y': 'yacht',
  'z': 'zebra'
};

// Number-word combinations for enhanced pronunciation
const numberWordCombinations = {
  // Format: { number: 'word' }
  '1': 'one',
  '2': 'two',
  '3': 'three',
  '4': 'four',
  '5': 'five',
  '6': 'six',
  '7': 'seven',
  '8': 'eight', 
  '9': 'nine',
  '10': 'ten',
  '11': 'eleven',
  '12': 'twelve',
  '13': 'thirteen',
  '14': 'fourteen',
  '15': 'fifteen',
  '16': 'sixteen',
  '17': 'seventeen',
  '18': 'eighteen',
  '19': 'nineteen',
  '20': 'twenty'
};

// Play letter + word pronunciation (e.g., "A for Apple")
const playLetterWithWord = (letter) => {
  try {
    // Check if audio context is running
    if (Tone.context.state !== 'running') {
      console.log('Audio context not ready for pronunciation. Enable audio first.');
      
      // Try to resume the audio context
      if (window._resumeAudio) {
        window._resumeAudio().then(success => {
          if (success) {
            console.log('Audio context resumed, retrying sound...');
            // Try playing the sound again after resuming
            setTimeout(() => playLetterWithWord(letter), 100);
          }
        });
      }
      return;
    }

    letter = letter.toLowerCase();
    console.log(`Playing letter with word: ${letter}`);
    
    // Create a dedicated synth for this letter sound
    const letterSynth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.01, decay: 0.1, sustain: 0.2, release: 0.5 }
    }).toDestination();
    
    // Map letters to musical notes (A-Z mapped across octaves)
    const letterNote = String.fromCharCode(((letter.charCodeAt(0) - 97) % 7) + 67) + 
                       Math.floor((letter.charCodeAt(0) - 97) / 7) + 4;
    
    // First play the letter sound
    letterSynth.triggerAttackRelease(letterNote, 0.3);
    console.log(`Played letter sound for: ${letter} (${letterNote})`);
    
    // Get the word associated with this letter
    const word = letterWordCombinations[letter];
    
    if (word) {
      console.log(`Will play word: ${word} after letter`);
      
      // Play "for" after a short pause
      setTimeout(() => {
        // Create a dedicated synth for "for" sound
        const forSynth = new Tone.Synth({
          oscillator: { type: 'triangle' },
          envelope: { attack: 0.02, decay: 0.1, sustain: 0.3, release: 0.4 }
        }).toDestination();
        
        forSynth.triggerAttackRelease('E4', '8n');
        console.log('Played "for" sound');
        
        // Then play the word after another short pause
        setTimeout(() => {
          // Create a dedicated synth for word sound
          const wordSynth = new Tone.Synth({
            oscillator: { type: 'sine' },
            envelope: { attack: 0.01, decay: 0.2, sustain: 0.4, release: 0.5 }
          }).toDestination();
          
          // Play a simple chord sequence for the word
          const now = Tone.now();
          wordSynth.triggerAttackRelease('C5', '8n', now);
          wordSynth.triggerAttackRelease('E5', '8n', now + 0.2);
          wordSynth.triggerAttackRelease('G5', '8n', now + 0.4);
          
          console.log(`Played word sound for: ${word}`);
        }, 400);
      }, 500);
    }
  } catch (error) {
    console.error('Error in letter pronunciation:', error);
  }
};

// Play number + word pronunciation (e.g., "1 is One")
const playNumberWithWord = (number) => {
  try {
    // Check if audio context is running
    if (Tone.context.state !== 'running') {
      console.log('Audio context not ready for number pronunciation. Enable audio first.');
      
      // Try to resume the audio context
      if (window._resumeAudio) {
        window._resumeAudio().then(success => {
          if (success) {
            console.log('Audio context resumed, retrying number sound...');
            // Try playing the sound again after resuming
            setTimeout(() => playNumberWithWord(number), 100);
          }
        });
      }
      return;
    }

    console.log(`Playing number with word: ${number}`);
    
    // Create a dedicated synth for this number sound
    const numberSynth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.01, decay: 0.1, sustain: 0.2, release: 0.5 }
    }).toDestination();
    
    // Map numbers to musical notes (using a base C scale)
    const noteIndex = (parseInt(number) - 1) % 8;
    const octave = Math.floor((parseInt(number) - 1) / 8) + 4;
    const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'];
    const numberNote = notes[noteIndex] + octave;
    
    // First play the number sound
    numberSynth.triggerAttackRelease(numberNote, 0.3);
    console.log(`Played number sound for: ${number} (${numberNote})`);
    
    // Get the word associated with this number
    const word = numberWordCombinations[number];
    
    if (word) {
      console.log(`Will play word: ${word} after number`);
      
      // Play "is" after a short pause
      setTimeout(() => {
        // Create a dedicated synth for "is" sound
        const isSynth = new Tone.Synth({
          oscillator: { type: 'triangle' },
          envelope: { attack: 0.02, decay: 0.1, sustain: 0.3, release: 0.4 }
        }).toDestination();
        
        isSynth.triggerAttackRelease('G4', '8n');
        console.log('Played "is" sound');
        
        // Then play the word after another short pause
        setTimeout(() => {
          // Create a dedicated synth for number word sound
          const wordSynth = new Tone.Synth({
            oscillator: { type: 'sine' },
            envelope: { attack: 0.01, decay: 0.2, sustain: 0.4, release: 0.5 }
          }).toDestination();
          
          // Play a simple chord sequence based on the number
          const now = Tone.now();
          
          // Different patterns based on number value
          if (parseInt(number) <= 10) {
            // Simple pattern for 1-10
            wordSynth.triggerAttackRelease('C5', '8n', now);
            wordSynth.triggerAttackRelease('E5', '8n', now + 0.2);
            wordSynth.triggerAttackRelease('G5', '8n', now + 0.4);
          } else {
            // More complex pattern for 11-20
            wordSynth.triggerAttackRelease('D5', '8n', now);
            wordSynth.triggerAttackRelease('F5', '8n', now + 0.15);
            wordSynth.triggerAttackRelease('A5', '8n', now + 0.3);
            wordSynth.triggerAttackRelease('C6', '8n', now + 0.45);
          }
          
          console.log(`Played word sound for number: ${word}`);
        }, 400);
      }, 500);
    }
  } catch (error) {
    console.error('Error in number pronunciation:', error);
  }
};

// Main sound playing function
export const playSound = (soundType, soundId = '', options = {}) => {
  try {
    // Log the sound request for debugging
    console.log(`Attempting to play sound: ${soundType} ${soundId}`, options);
    
    // Check if audio context is initialized
    if (!Tone.context || Tone.context.state !== 'running') {
      console.log(`Audio context not ready. State: ${Tone.context ? Tone.context.state : 'not created'}`);
      
      // Try to resume the audio context if it exists
      if (window._resumeAudio) {
        window._resumeAudio().then(success => {
          if (success) {
            console.log('Audio context resumed, retrying sound...');
            // Try playing the sound again after resuming
            setTimeout(() => playSound(soundType, soundId, options), 100);
          }
        });
      } else {
        // Create and start a new audio context if needed
        try {
          Tone.start().then(() => {
            console.log('Created and started new audio context, retrying sound...');
            // Try playing the sound again after starting
            setTimeout(() => playSound(soundType, soundId, options), 100);
          }).catch(err => {
            console.error('Failed to start audio context:', err);
          });
        } catch (err) {
          console.error('Error creating audio context:', err);
        }
      }
      return;
    }
    
    // Handle the various sound types
    switch (soundType) {
      case 'letter':
        if (options.withWord) {
          // Play letter + word pronunciation (e.g., "A for Apple")
          playLetterWithWord(soundId);
        } else if (letterSounds[soundId.toLowerCase()]) {
          // Just play the letter sound
          letterSounds[soundId.toLowerCase()]();
        } else {
          console.log(`No letter sound found for: ${soundId}`);
          // Play a fallback sound so the user knows something happened
          playTone('C4', 0.3);
        }
        break;
      case 'number':
        if (options.withWord) {
          // Play number + word pronunciation (e.g., "1 is One")
          playNumberWithWord(soundId);
        } else if (numberSounds[soundId]) {
          // Just play the number sound
          numberSounds[soundId]();
        } else {
          console.log(`No number sound found for: ${soundId}`);
          // Play a fallback sound so the user knows something happened
          playTone('E4', 0.3);
        }
        break;
      case 'word':
        if (wordSounds[soundId]) {
          wordSounds[soundId]();
        } else {
          console.log(`No word sound found for: ${soundId}`);
          // If no specific sound, play a generic one
          playTone('G4', 0.3);
        }
        break;
      default:
        // For general sound effects
        if (soundEffects[soundType]) {
          soundEffects[soundType]();
        } else {
          console.log(`No sound effect found for: ${soundType}`);
          // Play a fallback sound so the user knows something happened
          playTone('A4', 0.2);
        }
        break;
    }
  } catch (error) {
    console.error('Error playing sound:', error);
    
    // Try to play a simple error sound
    try {
      const errorSynth = new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope: { attack: 0.01, decay: 0.1, sustain: 0.1, release: 0.1 }
      }).toDestination();
      
      errorSynth.triggerAttackRelease('C3', 0.1);
    } catch (e) {
      // At this point we can't do anything more
      console.error('Failed to play error sound:', e);
    }
  }
};
