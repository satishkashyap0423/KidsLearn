// Collection of helper functions for the application

/**
 * Shuffles an array using the Fisher-Yates algorithm
 * @param {Array} array - The array to shuffle
 * @returns {Array} - A new shuffled array
 */
export const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

/**
 * Generates a random number between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Random number between min and max
 */
export const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Formats a number with leading zeros
 * @param {number} num - The number to format
 * @param {number} size - The desired string length
 * @returns {string} - Formatted number with leading zeros
 */
export const formatWithLeadingZeros = (num, size) => {
  let s = num.toString();
  while (s.length < size) s = "0" + s;
  return s;
};

/**
 * Capitalizes the first letter of each word in a string
 * @param {string} str - The string to capitalize
 * @returns {string} - Capitalized string
 */
export const capitalizeWords = (str) => {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Checks if device is in portrait orientation
 * @returns {boolean} - True if in portrait mode
 */
export const isPortrait = () => {
  return window.innerHeight > window.innerWidth;
};

/**
 * Debounces a function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Debounce wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Calculates age-appropriate difficulty level
 * @param {string} ageGroup - 'preStudents' or 'elementary'
 * @param {number} baseLevel - Base difficulty level
 * @returns {number} - Adjusted difficulty level
 */
export const calculateDifficultyLevel = (ageGroup, baseLevel = 1) => {
  if (ageGroup === 'preStudents') {
    return Math.max(1, baseLevel - 1);
  } else if (ageGroup === 'elementary') {
    return baseLevel + 1;
  }
  return baseLevel;
};

/**
 * Creates a random question for the given age group and subject
 * @param {string} ageGroup - 'preStudents' or 'elementary'
 * @param {string} subject - 'alphabet', 'counting', 'sentences', 'math', or 'images'
 * @returns {Object} - Question object
 */
export const createRandomQuestion = (ageGroup, subject) => {
  switch (subject) {
    case 'alphabet':
      return createAlphabetQuestion(ageGroup);
    case 'counting':
      return createCountingQuestion(ageGroup);
    case 'math':
      return createMathQuestion(ageGroup);
    case 'sentences':
      return createSentenceQuestion();
    case 'images':
      return createImageQuestion();
    default:
      return null;
  }
};

/**
 * Creates a random alphabet question
 * @param {string} ageGroup - 'preStudents' or 'elementary'
 * @returns {Object} - Alphabet question
 */
const createAlphabetQuestion = (ageGroup) => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const randomIndex = getRandomNumber(0, alphabet.length - 1);
  const letter = alphabet[randomIndex];
  
  return {
    letter,
    questionType: ageGroup === 'preStudents' ? 'identify' : 'word',
    options: shuffleArray([
      letter,
      alphabet[getRandomNumber(0, alphabet.length - 1)],
      alphabet[getRandomNumber(0, alphabet.length - 1)],
      alphabet[getRandomNumber(0, alphabet.length - 1)]
    ])
  };
};

/**
 * Creates a random counting question
 * @param {string} ageGroup - 'preStudents' or 'elementary'
 * @returns {Object} - Counting question
 */
const createCountingQuestion = (ageGroup) => {
  const maxNumber = ageGroup === 'preStudents' ? 10 : 20;
  const number = getRandomNumber(1, maxNumber);
  
  return {
    number,
    questionType: 'count',
    options: shuffleArray([
      number,
      getRandomNumber(1, maxNumber),
      getRandomNumber(1, maxNumber),
      getRandomNumber(1, maxNumber)
    ])
  };
};

/**
 * Creates a random math question
 * @param {string} ageGroup - 'preStudents' or 'elementary'
 * @returns {Object} - Math question
 */
const createMathQuestion = (ageGroup) => {
  let num1, num2, answer, operation;
  
  if (ageGroup === 'preStudents') {
    // Simple addition only for pre-students
    operation = 'addition';
    num1 = getRandomNumber(1, 5);
    num2 = getRandomNumber(1, 5);
    answer = num1 + num2;
  } else {
    // All operations for elementary
    const operations = ['addition', 'subtraction', 'multiplication'];
    operation = operations[getRandomNumber(0, operations.length - 1)];
    
    switch (operation) {
      case 'addition':
        num1 = getRandomNumber(1, 10);
        num2 = getRandomNumber(1, 10);
        answer = num1 + num2;
        break;
      case 'subtraction':
        num1 = getRandomNumber(5, 15);
        num2 = getRandomNumber(1, num1);
        answer = num1 - num2;
        break;
      case 'multiplication':
        num1 = getRandomNumber(1, 5);
        num2 = getRandomNumber(1, 5);
        answer = num1 * num2;
        break;
    }
  }
  
  return {
    num1,
    num2,
    operation,
    answer,
    questionType: 'solve'
  };
};

/**
 * Creates a random sentence completion question
 * @returns {Object} - Sentence question
 */
const createSentenceQuestion = () => {
  const sentences = [
    { text: "The dog ___ the ball", options: ["chased", "eating", "sleeps", "barking"], answer: "chased" },
    { text: "I ___ to school", options: ["go", "sleep", "eat", "play"], answer: "go" },
    { text: "The cat is ___ on the chair", options: ["sitting", "runs", "jumping", "eating"], answer: "sitting" }
  ];
  
  return sentences[getRandomNumber(0, sentences.length - 1)];
};

/**
 * Creates a random image recognition question
 * @returns {Object} - Image question
 */
const createImageQuestion = () => {
  const images = [
    { id: 'apple', name: 'Apple', emoji: '🍎' },
    { id: 'cat', name: 'Cat', emoji: '🐱' },
    { id: 'dog', name: 'Dog', emoji: '🐶' },
    { id: 'ball', name: 'Ball', emoji: '⚽' },
    { id: 'banana', name: 'Banana', emoji: '🍌' }
  ];
  
  const selectedImage = images[getRandomNumber(0, images.length - 1)];
  const options = shuffleArray([
    selectedImage,
    ...shuffleArray(images.filter(img => img.id !== selectedImage.id)).slice(0, 3)
  ]);
  
  return {
    image: selectedImage,
    questionType: 'identify',
    options
  };
};
