// Analytics routes
const express = require('express');
const router = express.Router();
const {
  getUserAnalytics,
  recordUserActivity,
  startUserSession,
  addUserMilestone,
  getLearningRecommendations,
  getParentalSummary
} = require('../controllers/analyticsController');

// GET analytics for a specific user
router.get('/users/:userId', getUserAnalytics);

// POST to record a user activity
router.post('/users/:userId/activity', recordUserActivity);

// POST to start a new session
router.post('/users/:userId/session', startUserSession);

// POST to add a milestone
router.post('/users/:userId/milestone', addUserMilestone);

// GET learning recommendations
router.get('/users/:userId/recommendations', getLearningRecommendations);

// GET parental summary view
router.get('/users/:userId/parental-summary', getParentalSummary);

module.exports = router;