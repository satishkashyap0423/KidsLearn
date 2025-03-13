const inMemoryDB = require('../models/inMemoryDB');

// Get progress for a user
const getProgressByUserId = (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if user exists
    const user = inMemoryDB.findUser(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get progress
    const progress = inMemoryDB.getProgressByUserId(userId);
    
    res.json(progress || {
      stars: 0,
      modules: {
        alphabet: { progress: 0, completed: false },
        counting: { progress: 0, completed: false },
        sentences: { progress: 0, completed: false },
        math: { progress: 0, completed: false },
        images: { progress: 0, completed: false }
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update progress for a user
const updateProgress = (req, res) => {
  try {
    const { userId } = req.params;
    const { module, progressValue, isCompleted } = req.body;
    
    // Validate required fields
    if (!module || progressValue === undefined) {
      return res.status(400).json({ message: 'Module and progress value are required' });
    }
    
    // Check if user exists
    const user = inMemoryDB.findUser(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get current progress to calculate stars to award
    const currentProgress = inMemoryDB.getProgressByUserId(userId) || {
      stars: 0,
      modules: {}
    };
    
    // Calculate stars to award based on progress increase
    let starsToAdd = 0;
    const currentModuleData = currentProgress.modules[module] || { progress: 0, completed: false };
    
    if (progressValue > currentModuleData.progress) {
      // Award stars proportional to progress increase
      // For every 10% increase, award 1 star
      starsToAdd = Math.floor((progressValue - currentModuleData.progress) / 10);
    }
    
    // Award bonus stars for completion
    if (isCompleted && !currentModuleData.completed) {
      starsToAdd += 5; // Bonus for completing a module
    }
    
    // Update progress
    const updatedProgress = inMemoryDB.updateProgress(userId, module, {
      progress: progressValue,
      completed: !!isCompleted,
      starsToAdd
    });
    
    res.json(updatedProgress);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Reset progress for a user
const resetProgress = (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if user exists
    const user = inMemoryDB.findUser(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Reset progress
    inMemoryDB.resetProgress(userId);
    
    res.json({ 
      message: 'Progress reset successfully',
      progress: {
        stars: 0,
        modules: {
          alphabet: { progress: 0, completed: false },
          counting: { progress: 0, completed: false },
          sentences: { progress: 0, completed: false },
          math: { progress: 0, completed: false },
          images: { progress: 0, completed: false }
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get leaderboard (top users by stars)
const getLeaderboard = (req, res) => {
  try {
    const leaderboard = inMemoryDB.getLeaderboard();
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getProgressByUserId,
  updateProgress,
  resetProgress,
  getLeaderboard
};
