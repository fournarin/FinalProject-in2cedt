const express = require('express');
const router = express.Router();
const SubmissionController = require('../controllers/submissionController');

// submit code (grader)
router.post('/submit', SubmissionController.submitCode);

// get submission by id
router.get('/:submissionId', SubmissionController.getSubmissionResults);

// list user's submissions
router.get('/user/:userId', SubmissionController.getUserSubmissions);

// list shared submissions (public)
router.get('/shared', SubmissionController.getSharedSubmissions);

// get source of a shared submission
router.get('/source/:submissionId', SubmissionController.getSubmissionSource);

// delete submission
router.delete('/:submissionId', SubmissionController.deleteSubmission);

module.exports = router;