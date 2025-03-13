// Analytics controller
const {
  getAnalyticsByUserId,
  recordActivity,
  startSession,
  addMilestone,
  findUser
} = require('../models/inMemoryDB');

// Get analytics for a specific user
const getUserAnalytics = (req, res) => {
  const { userId } = req.params;
  
  try {
    const analytics = getAnalyticsByUserId(userId);
    
    if (!analytics) {
      return res.status(404).json({
        message: 'Analytics not found for this user'
      });
    }
    
    // Get user details to add context
    const user = findUser(userId);
    
    return res.status(200).json({
      userId,
      userName: user ? user.name : 'Unknown User',
      ageGroup: user ? user.ageGroup : 'unknown',
      analytics
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return res.status(500).json({
      message: 'Failed to retrieve analytics'
    });
  }
};

// Record a new activity for a user
const recordUserActivity = (req, res) => {
  const { userId } = req.params;
  const { module, timeSpent, isCorrect, itemId, challengeArea } = req.body;
  
  try {
    if (!module) {
      return res.status(400).json({
        message: 'Module name is required'
      });
    }
    
    const updatedAnalytics = recordActivity(userId, module, {
      timeSpent: timeSpent || 0,
      isCorrect,
      itemId,
      challengeArea
    });
    
    return res.status(200).json({
      message: 'Activity recorded successfully',
      analytics: updatedAnalytics
    });
  } catch (error) {
    console.error('Error recording activity:', error);
    return res.status(500).json({
      message: 'Failed to record activity'
    });
  }
};

// Start a new learning session
const startUserSession = (req, res) => {
  const { userId } = req.params;
  
  try {
    const updatedAnalytics = startSession(userId);
    
    return res.status(200).json({
      message: 'Session started successfully',
      session: {
        sessionCount: updatedAnalytics.sessionsCount,
        startTime: updatedAnalytics.lastSession
      }
    });
  } catch (error) {
    console.error('Error starting session:', error);
    return res.status(500).json({
      message: 'Failed to start session'
    });
  }
};

// Add a new milestone for a user
const addUserMilestone = (req, res) => {
  const { userId } = req.params;
  const { title, description, type } = req.body;
  
  try {
    if (!title || !type) {
      return res.status(400).json({
        message: 'Title and type are required for a milestone'
      });
    }
    
    const updatedAnalytics = addMilestone(userId, {
      title,
      description,
      type
    });
    
    return res.status(200).json({
      message: 'Milestone added successfully',
      milestones: updatedAnalytics.milestones
    });
  } catch (error) {
    console.error('Error adding milestone:', error);
    return res.status(500).json({
      message: 'Failed to add milestone'
    });
  }
};

// Get learning recommendations for a user
const getLearningRecommendations = (req, res) => {
  const { userId } = req.params;
  
  try {
    const analytics = getAnalyticsByUserId(userId);
    
    if (!analytics) {
      return res.status(404).json({
        message: 'Analytics not found for this user'
      });
    }
    
    // Calculate recommendations based on strengths and weaknesses
    const recommendations = [];
    
    // Recommend focusing on weak areas first
    if (analytics.weaknesses.length > 0) {
      analytics.weaknesses.forEach(module => {
        recommendations.push({
          module,
          reason: `This is an area that needs improvement`,
          priority: 'high'
        });
      });
    }
    
    // Then suggest building on strengths
    if (analytics.strengths.length > 0) {
      analytics.strengths.forEach(module => {
        recommendations.push({
          module,
          reason: `This is an area of strength to build upon`,
          priority: 'medium'
        });
      });
    }
    
    // If no clear strengths or weaknesses, recommend based on recent activity
    if (recommendations.length === 0) {
      // Find module with most recent activity
      let mostRecentModule = null;
      let mostRecentTime = 0;
      
      Object.entries(analytics.moduleAnalytics).forEach(([module, data]) => {
        if (data.lastActivity && new Date(data.lastActivity).getTime() > mostRecentTime) {
          mostRecentModule = module;
          mostRecentTime = new Date(data.lastActivity).getTime();
        }
      });
      
      if (mostRecentModule) {
        recommendations.push({
          module: mostRecentModule,
          reason: `Continue with this recent activity`,
          priority: 'medium'
        });
      }
    }
    
    return res.status(200).json({
      recommendations,
      basedOn: {
        strengths: analytics.strengths,
        weaknesses: analytics.weaknesses,
        learningPace: analytics.learningPace
      }
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return res.status(500).json({
      message: 'Failed to generate recommendations'
    });
  }
};

// Get summary statistics for parental view
const getParentalSummary = (req, res) => {
  const { userId } = req.params;
  
  try {
    const analytics = getAnalyticsByUserId(userId);
    
    if (!analytics) {
      return res.status(404).json({
        message: 'Analytics not found for this user'
      });
    }
    
    // Get user details
    const user = findUser(userId);
    
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }
    
    // Calculate summary statistics
    const totalCorrectAnswers = Object.values(analytics.moduleAnalytics)
      .reduce((sum, data) => sum + data.correctAnswers, 0);
    
    const totalIncorrectAnswers = Object.values(analytics.moduleAnalytics)
      .reduce((sum, data) => sum + data.incorrectAnswers, 0);
    
    const totalAnswers = totalCorrectAnswers + totalIncorrectAnswers;
    
    const accuracyRate = totalAnswers > 0 
      ? Math.round((totalCorrectAnswers / totalAnswers) * 100) 
      : 0;
    
    // Create module-specific summaries
    const moduleSummaries = Object.entries(analytics.moduleAnalytics)
      .map(([module, data]) => {
        const totalModuleAnswers = data.correctAnswers + data.incorrectAnswers;
        const moduleAccuracy = totalModuleAnswers > 0
          ? Math.round((data.correctAnswers / totalModuleAnswers) * 100)
          : 0;
          
        return {
          name: module,
          timeSpent: data.timeSpent,
          correctAnswers: data.correctAnswers,
          incorrectAnswers: data.incorrectAnswers,
          accuracy: moduleAccuracy,
          challengeAreas: data.challengeAreas,
          lastActivity: data.lastActivity
        };
      })
      .filter(module => module.correctAnswers > 0 || module.incorrectAnswers > 0);
    
    return res.status(200).json({
      childName: user.name,
      ageGroup: user.ageGroup,
      overallSummary: {
        totalSessions: analytics.sessionsCount,
        totalTimeSpent: analytics.totalTimeSpent,
        lastSession: analytics.lastSession,
        totalCorrectAnswers,
        totalIncorrectAnswers,
        accuracyRate,
        learningPace: analytics.learningPace
      },
      strengths: analytics.strengths,
      weaknesses: analytics.weaknesses,
      moduleSummaries,
      milestones: analytics.milestones
    });
  } catch (error) {
    console.error('Error generating parental summary:', error);
    return res.status(500).json({
      message: 'Failed to generate parental summary'
    });
  }
};

module.exports = {
  getUserAnalytics,
  recordUserActivity,
  startUserSession,
  addUserMilestone,
  getLearningRecommendations,
  getParentalSummary
};