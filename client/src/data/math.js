const math = [
  // Addition Problems
  {
    id: 'add1',
    operation: 'addition',
    num1: 2,
    num2: 3,
    answer: 5,
    emoji: '🍎',
    tip: 'Count the total number of objects when putting two groups together.'
  },
  {
    id: 'add2',
    operation: 'addition',
    num1: 4,
    num2: 2,
    answer: 6,
    emoji: '🍌',
    tip: 'When adding, the total is always larger than each of the numbers you started with.'
  },
  {
    id: 'add3',
    operation: 'addition',
    num1: 3,
    num2: 5,
    answer: 8,
    emoji: '🧁',
    tip: 'Think of addition as combining groups of objects together.'
  },
  {
    id: 'add4',
    operation: 'addition',
    num1: 6,
    num2: 3,
    answer: 9,
    emoji: '🎈',
    tip: 'You can count forward to add numbers together.'
  },
  {
    id: 'add5',
    operation: 'addition',
    num1: 5,
    num2: 5,
    answer: 10,
    emoji: '🖐️',
    tip: 'Five plus five equals ten, like your ten fingers!'
  },
  {
    id: 'add6',
    operation: 'addition',
    num1: 7,
    num2: 2,
    answer: 9,
    emoji: '🥕',
    tip: 'Try counting up from the larger number to find the sum.'
  },
  {
    id: 'add7',
    operation: 'addition',
    num1: 8,
    num2: 1,
    answer: 9,
    emoji: '🐢',
    tip: 'Adding 1 is like taking one step forward when counting.'
  },
  {
    id: 'add8',
    operation: 'addition',
    num1: 4,
    num2: 4,
    answer: 8,
    emoji: '🦋',
    tip: 'Doubles like 4+4 are good to memorize - they\'re used often!'
  },
  {
    id: 'add9',
    operation: 'addition',
    num1: 3,
    num2: 4,
    answer: 7,
    emoji: '🍦',
    tip: 'Try using your fingers to count up and find the sum.'
  },
  {
    id: 'add10',
    operation: 'addition',
    num1: 1,
    num2: 9,
    answer: 10,
    emoji: '🎯',
    tip: 'Adding 9 to a number is like adding 10 and then subtracting 1.'
  },
  
  // Subtraction Problems
  {
    id: 'sub1',
    operation: 'subtraction',
    num1: 5,
    num2: 2,
    answer: 3,
    emoji: '🍓',
    tip: 'Subtraction means taking away or removing some objects.'
  },
  {
    id: 'sub2',
    operation: 'subtraction',
    num1: 7,
    num2: 3,
    answer: 4,
    emoji: '🌮',
    tip: 'When subtracting, the answer is always less than the number you started with.'
  },
  {
    id: 'sub3',
    operation: 'subtraction',
    num1: 9,
    num2: 5,
    answer: 4,
    emoji: '🍉',
    tip: 'Think of subtraction as finding what\'s left after removing some items.'
  },
  {
    id: 'sub4',
    operation: 'subtraction',
    num1: 8,
    num2: 4,
    answer: 4,
    emoji: '🧩',
    tip: 'You can count backward to subtract numbers.'
  },
  {
    id: 'sub5',
    operation: 'subtraction',
    num1: 10,
    num2: 3,
    answer: 7,
    emoji: '🎁',
    tip: 'Subtraction is like addition in reverse.'
  },
  {
    id: 'sub6',
    operation: 'subtraction',
    num1: 6,
    num2: 1,
    answer: 5,
    emoji: '🦄',
    tip: 'Subtracting 1 is like taking one step backward when counting.'
  },
  {
    id: 'sub7',
    operation: 'subtraction',
    num1: 10,
    num2: 5,
    answer: 5,
    emoji: '🦊',
    tip: 'Half of 10 is 5, so 10 - 5 = 5.'
  },
  {
    id: 'sub8',
    operation: 'subtraction',
    num1: 9,
    num2: 2,
    answer: 7,
    emoji: '🍇',
    tip: 'Subtraction tells you the difference between two numbers.'
  },
  {
    id: 'sub9',
    operation: 'subtraction',
    num1: 7,
    num2: 7,
    answer: 0,
    emoji: '0️⃣',
    tip: 'When you subtract a number from itself, you always get zero.'
  },
  {
    id: 'sub10',
    operation: 'subtraction',
    num1: 10,
    num2: 1,
    answer: 9,
    emoji: '🏀',
    tip: 'Subtracting 1 from a number gives you the number right before it when counting.'
  },
  
  // Multiplication Problems
  {
    id: 'mult1',
    operation: 'multiplication',
    num1: 2,
    num2: 3,
    answer: 6,
    emoji: '🍭',
    tip: 'Multiplication is like adding the same number multiple times. 2×3 means 2+2+2 or 3+3.'
  },
  {
    id: 'mult2',
    operation: 'multiplication',
    num1: 4,
    num2: 2,
    answer: 8,
    emoji: '🚂',
    tip: 'Think of multiplication as having multiple groups with the same number of objects.'
  },
  {
    id: 'mult3',
    operation: 'multiplication',
    num1: 3,
    num2: 3,
    answer: 9,
    emoji: '🍕',
    tip: '3×3 means 3 groups of 3, which is 9.'
  },
  {
    id: 'mult4',
    operation: 'multiplication',
    num1: 5,
    num2: 2,
    answer: 10,
    emoji: '🐘',
    tip: 'Multiplying by 2 is like doubling a number.'
  },
  {
    id: 'mult5',
    operation: 'multiplication',
    num1: 2,
    num2: 5,
    answer: 10,
    emoji: '🦒',
    tip: 'Multiplication is commutative: 2×5 is the same as 5×2.'
  },
  {
    id: 'mult6',
    operation: 'multiplication',
    num1: 4,
    num2: 3,
    answer: 12,
    emoji: '🐪',
    tip: '4×3 means 4 groups of 3 or 3 groups of 4.'
  },
  {
    id: 'mult7',
    operation: 'multiplication',
    num1: 3,
    num2: 4,
    answer: 12,
    emoji: '🦜',
    tip: 'Learning the multiplication table helps you solve problems faster!'
  },
  {
    id: 'mult8',
    operation: 'multiplication',
    num1: 2,
    num2: 2,
    answer: 4,
    emoji: '🦔',
    tip: '2×2 is a square number - it forms a perfect square pattern!'
  },
  {
    id: 'mult9',
    operation: 'multiplication',
    num1: 1,
    num2: 10,
    answer: 10,
    emoji: '🦩',
    tip: 'Multiplying by 1 doesn\'t change the number - you get the same number back.'
  },
  {
    id: 'mult10',
    operation: 'multiplication',
    num1: 0,
    num2: 5,
    answer: 0,
    emoji: '🔄',
    tip: 'Multiplying any number by 0 always gives 0 as the answer.'
  }
];

export default math;
