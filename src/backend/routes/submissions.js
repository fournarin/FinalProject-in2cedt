const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');

// Route to submit code
router.post('/submit', submissionController.submitCode);

// Route to get submission results
router.get('/:submissionId/results', submissionController.getSubmissionResults);

// Route to get all submissions for a user
router.get('/user/:userId', submissionController.getUserSubmissions);

// Route to delete a submission
router.delete('/:submissionId', submissionController.deleteSubmission);

module.exports = router;