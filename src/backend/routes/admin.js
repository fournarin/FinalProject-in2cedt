const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');

// Route to get all problems
router.get('/problems', adminController.getAllProblems);

// Route to create a new problem
router.post('/problems', adminController.createProblem);

// Route to update an existing problem
router.put('/problems/:id', adminController.updateProblem);

// Route to delete a problem
router.delete('/problems/:id', adminController.deleteProblem);

// Route to get all submissions
router.get('/submissions', adminController.getAllSubmissions);

// Route to view a specific submission
router.get('/submissions/:id', adminController.getSubmissionById);

// Route to update submission status
router.put('/submissions/:id/status', adminController.updateSubmissionStatus);

// Route to get leaderboard
router.get('/leaderboard', adminController.getLeaderboard);

module.exports = router;