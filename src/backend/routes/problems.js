const express = require('express');
const router = express.Router();
const problemsController = require('../controllers/problemsController');

// Route to get all problems
router.get('/', problemsController.getAllProblems);

// Route to get a specific problem by ID
router.get('/:id', problemsController.getProblemById);

// Route to create a new problem (admin only)
router.post('/', problemsController.createProblem);

// Route to update an existing problem (admin only)
router.put('/:id', problemsController.updateProblem);

// Route to delete a problem (admin only)
router.delete('/:id', problemsController.deleteProblem);

module.exports = router;