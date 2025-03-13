// In-memory database for storing user and progress data
// This is a simple implementation for prototyping purposes
// In a production environment, this would be replaced with a real database

// Store for users
const users = new Map();

// Store for progress data
const progressData = new Map();

// Store for detailed analytics data
const analyticsData = new Map();

// Generate a unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

// User methods
const findUser = (id) => {
  return users.get(id);
};

const createUser = (userData) => {
  const id = generateId();
  const newUser = { id, ...userData };
  users.set(id, newUser);
  
  // Initialize empty progress for the user
  resetProgress(id);
  
  return newUser;
};

const updateUser = (id, updates) => {
  const user = findUser(id);
  if (!user) return null;
  
  const updatedUser = { ...user, ...updates };
  users.set(id, updatedUser);
  
  return updatedUser;
};

const deleteUser = (id) => {
  const result = users.delete(id);
  // Also delete associated progress and analytics
  progressData.delete(id);
  analyticsData.delete(id);
  return result;
};

// Progress methods
const getProgressByUserId = (userId) => {
  return progressData.get(userId);
};

const updateProgress = (userId, module, { progress, completed, starsToAdd = 0 }) => {
  const currentProgress = progressData.get(userId) || {
    stars: 0,
    modules: {
      alphabet: { progress: 0, completed: false },
      counting: { progress: 0, completed: false },
      sentences: { progress: 0, completed: false },
      math: { progress: 0, completed: false },
      images: { progress: 0, completed: false }
    }
  };
  
  // Update the specific module's progress
  const updatedProgress = {
    ...currentProgress,
    stars: currentProgress.stars + starsToAdd,
    modules: {
      ...currentProgress.modules,
      [module]: {
        progress,
        completed
      }
    }
  };
  
  progressData.set(userId, updatedProgress);
  return updatedProgress;
};

const resetProgress = (userId) => {
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
  
  progressData.set(userId, freshProgress);
  
  // Also initialize analytics data
  initializeAnalytics(userId);
  
  return freshProgress;
};

// Analytics methods
const initializeAnalytics = (userId) => {
  const freshAnalytics = {
    sessionsCount: 0,
    totalTimeSpent: 0, // in minutes
    lastSession: null,
    moduleAnalytics: {
      alphabet: {
        timeSpent: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        completedItems: [],
        challengeAreas: [],
        lastActivity: null
      },
      counting: {
        timeSpent: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        completedItems: [],
        challengeAreas: [],
        lastActivity: null
      },
      sentences: {
        timeSpent: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        completedItems: [],
        challengeAreas: [],
        lastActivity: null
      },
      math: {
        timeSpent: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        completedItems: [],
        challengeAreas: [],
        lastActivity: null
      },
      images: {
        timeSpent: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        completedItems: [],
        challengeAreas: [],
        lastActivity: null
      }
    },
    strengths: [],
    weaknesses: [],
    learningPath: {
      recommended: [],
      completed: []
    },
    learningPace: "average", // can be "slow", "average", "fast"
    milestones: []
  };
  
  analyticsData.set(userId, freshAnalytics);
  return freshAnalytics;
};

// Analytics tracking methods
const getAnalyticsByUserId = (userId) => {
  return analyticsData.get(userId);
};

const recordActivity = (userId, module, activityData) => {
  const currentAnalytics = analyticsData.get(userId);
  if (!currentAnalytics) {
    return initializeAnalytics(userId);
  }
  
  const {
    timeSpent = 0,
    isCorrect,
    itemId,
    challengeArea = null
  } = activityData;
  
  const updatedModuleAnalytics = {
    ...currentAnalytics.moduleAnalytics[module],
    timeSpent: currentAnalytics.moduleAnalytics[module].timeSpent + timeSpent,
    lastActivity: new Date()
  };
  
  // Update correct/incorrect answers if applicable
  if (isCorrect !== undefined) {
    if (isCorrect) {
      updatedModuleAnalytics.correctAnswers += 1;
      
      // Add to completed items if not already there
      if (itemId && !updatedModuleAnalytics.completedItems.includes(itemId)) {
        updatedModuleAnalytics.completedItems.push(itemId);
      }
    } else {
      updatedModuleAnalytics.incorrectAnswers += 1;
      
      // Add to challenge areas if not already there
      if (challengeArea && !updatedModuleAnalytics.challengeAreas.includes(challengeArea)) {
        updatedModuleAnalytics.challengeAreas.push(challengeArea);
      }
    }
  }
  
  // Update the overall analytics
  const updatedAnalytics = {
    ...currentAnalytics,
    totalTimeSpent: currentAnalytics.totalTimeSpent + timeSpent,
    moduleAnalytics: {
      ...currentAnalytics.moduleAnalytics,
      [module]: updatedModuleAnalytics
    }
  };
  
  // Update strengths and weaknesses based on performance
  updatedAnalytics.strengths = calculateStrengths(updatedAnalytics);
  updatedAnalytics.weaknesses = calculateWeaknesses(updatedAnalytics);
  
  // Determine learning pace
  updatedAnalytics.learningPace = calculateLearningPace(updatedAnalytics);
  
  analyticsData.set(userId, updatedAnalytics);
  return updatedAnalytics;
};

const startSession = (userId) => {
  const currentAnalytics = analyticsData.get(userId);
  if (!currentAnalytics) {
    return initializeAnalytics(userId);
  }
  
  const updatedAnalytics = {
    ...currentAnalytics,
    sessionsCount: currentAnalytics.sessionsCount + 1,
    lastSession: new Date()
  };
  
  analyticsData.set(userId, updatedAnalytics);
  return updatedAnalytics;
};

const addMilestone = (userId, milestone) => {
  const currentAnalytics = analyticsData.get(userId);
  if (!currentAnalytics) {
    return initializeAnalytics(userId);
  }
  
  const newMilestone = {
    id: generateId(),
    date: new Date(),
    ...milestone
  };
  
  const updatedAnalytics = {
    ...currentAnalytics,
    milestones: [...currentAnalytics.milestones, newMilestone]
  };
  
  analyticsData.set(userId, updatedAnalytics);
  return updatedAnalytics;
};

// Helper functions for analytics
const calculateStrengths = (analytics) => {
  const strengths = [];
  
  // Consider a module a strength if correctAnswers > incorrectAnswers * 2
  Object.entries(analytics.moduleAnalytics).forEach(([moduleName, moduleData]) => {
    if (moduleData.correctAnswers > 0 && 
        moduleData.correctAnswers > moduleData.incorrectAnswers * 2) {
      strengths.push(moduleName);
    }
  });
  
  return strengths;
};

const calculateWeaknesses = (analytics) => {
  const weaknesses = [];
  
  // Consider a module a weakness if incorrectAnswers >= correctAnswers
  Object.entries(analytics.moduleAnalytics).forEach(([moduleName, moduleData]) => {
    if (moduleData.incorrectAnswers > 0 && 
        moduleData.incorrectAnswers >= moduleData.correctAnswers) {
      weaknesses.push(moduleName);
    }
  });
  
  return weaknesses;
};

const calculateLearningPace = (analytics) => {
  // Calculate learning pace based on average time spent per correct answer
  let totalCorrectAnswers = 0;
  let totalTimeForCorrectAnswers = 0;
  
  Object.values(analytics.moduleAnalytics).forEach(moduleData => {
    totalCorrectAnswers += moduleData.correctAnswers;
    if (moduleData.correctAnswers > 0) {
      // Estimate time spent on correct answers proportionally
      const correctAnswerRatio = moduleData.correctAnswers / 
                                (moduleData.correctAnswers + moduleData.incorrectAnswers || 1);
      totalTimeForCorrectAnswers += moduleData.timeSpent * correctAnswerRatio;
    }
  });
  
  if (totalCorrectAnswers === 0) return "average"; // Default
  
  const averageTimePerCorrectAnswer = totalTimeForCorrectAnswers / totalCorrectAnswers;
  
  // Define thresholds for learning pace (these can be adjusted)
  if (averageTimePerCorrectAnswer < 1) { // Less than 1 minute per correct answer
    return "fast";
  } else if (averageTimePerCorrectAnswer > 3) { // More than 3 minutes per correct answer
    return "slow";
  } else {
    return "average";
  }
};

const getLeaderboard = (limit = 10) => {
  // Convert map to array, sort by stars (descending), and limit the results
  const progressArray = Array.from(progressData.entries())
    .map(([userId, progress]) => {
      const user = findUser(userId);
      return {
        userId,
        name: user ? user.name : 'Unknown User',
        ageGroup: user ? user.ageGroup : 'unknown',
        stars: progress.stars
      };
    })
    .sort((a, b) => b.stars - a.stars)
    .slice(0, limit);
  
  return progressArray;
};

// For development purposes: pre-populate with some data
const initializeDemoData = () => {
  // Create demo users
  const user1 = createUser({
    name: 'Little Alex',
    ageGroup: 'preStudents',
    parentEmail: 'parent@example.com',
    createdAt: new Date()
  });
  
  const user2 = createUser({
    name: 'Emma',
    ageGroup: 'elementary',
    parentEmail: 'parent2@example.com',
    createdAt: new Date()
  });
  
  // Add some progress
  updateProgress(user1.id, 'alphabet', { progress: 30, completed: false, starsToAdd: 3 });
  updateProgress(user1.id, 'counting', { progress: 20, completed: false, starsToAdd: 2 });
  
  updateProgress(user2.id, 'alphabet', { progress: 100, completed: true, starsToAdd: 10 });
  updateProgress(user2.id, 'counting', { progress: 80, completed: false, starsToAdd: 8 });
  updateProgress(user2.id, 'sentences', { progress: 50, completed: false, starsToAdd: 5 });
  updateProgress(user2.id, 'math', { progress: 40, completed: false, starsToAdd: 4 });
  
  // Add some analytics data
  // Start sessions for both users
  startSession(user1.id);
  startSession(user2.id);
  
  // Record some activities for user1
  recordActivity(user1.id, 'alphabet', {
    timeSpent: 5,
    isCorrect: true,
    itemId: 'a'
  });
  
  recordActivity(user1.id, 'alphabet', {
    timeSpent: 3,
    isCorrect: false,
    challengeArea: 'letter-recognition'
  });
  
  recordActivity(user1.id, 'counting', {
    timeSpent: 4,
    isCorrect: true,
    itemId: 'counting-1-10'
  });
  
  // Add a milestone for user1
  addMilestone(user1.id, {
    title: 'First Login',
    description: 'Logged in for the first time',
    type: 'achievement'
  });
  
  // Record more activities for user2
  recordActivity(user2.id, 'alphabet', {
    timeSpent: 10,
    isCorrect: true,
    itemId: 'alphabet-complete'
  });
  
  recordActivity(user2.id, 'counting', {
    timeSpent: 8,
    isCorrect: true,
    itemId: 'counting-1-20'
  });
  
  recordActivity(user2.id, 'math', {
    timeSpent: 12,
    isCorrect: false,
    challengeArea: 'subtraction'
  });
  
  recordActivity(user2.id, 'sentences', {
    timeSpent: 15,
    isCorrect: true,
    itemId: 'basic-sentences'
  });
  
  // Add milestones for user2
  addMilestone(user2.id, {
    title: 'Alphabet Master',
    description: 'Completed the entire alphabet module',
    type: 'completion'
  });
  
  addMilestone(user2.id, {
    title: 'Math Explorer',
    description: 'Started exploring math concepts',
    type: 'progress'
  });
};

// Only initialize demo data in development environment
if (process.env.NODE_ENV !== 'production') {
  initializeDemoData();
}

module.exports = {
  // User methods
  findUser,
  createUser,
  updateUser,
  deleteUser,
  
  // Basic progress methods
  getProgressByUserId,
  updateProgress,
  resetProgress,
  getLeaderboard,
  
  // Advanced analytics methods
  getAnalyticsByUserId,
  recordActivity,
  startSession,
  addMilestone
};
