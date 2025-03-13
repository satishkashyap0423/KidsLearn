const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');

// GET progress for a user
router.get('/user/:userId', progressController.getProgressByUserId);

// PUT update progress for a user
router.put('/user/:userId', progressController.updateProgress);

// POST reset progress for a user
router.post('/user/:userId/reset', progressController.resetProgress);

// GET leaderboard
router.get('/leaderboard', progressController.getLeaderboard);

module.exports = router;
