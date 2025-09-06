const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');
const problemsFile = path.join(dataDir, 'problems.json');
const submissionsFile = path.join(dataDir, 'submissions.json');
const rankingsFile = path.join(dataDir, 'rankings.json');

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(problemsFile)) fs.writeFileSync(problemsFile, JSON.stringify([]));
if (!fs.existsSync(submissionsFile)) fs.writeFileSync(submissionsFile, JSON.stringify([]));
if (!fs.existsSync(rankingsFile)) fs.writeFileSync(rankingsFile, JSON.stringify([]));

function loadProblems() { return JSON.parse(fs.readFileSync(problemsFile)); }
function saveProblems(p) { fs.writeFileSync(problemsFile, JSON.stringify(p, null, 2)); }
function loadSubmissions() { return JSON.parse(fs.readFileSync(submissionsFile)); }
function saveSubmissions(s) { fs.writeFileSync(submissionsFile, JSON.stringify(s, null, 2)); }
function loadRankings() { return JSON.parse(fs.readFileSync(rankingsFile)); }
function saveRankings(r) { fs.writeFileSync(rankingsFile, JSON.stringify(r, null, 2)); }

// Problems management (reuse similar to problemsController)
exports.getAllProblems = (req, res) => res.json(loadProblems());
exports.createProblem = (req, res) => {
    const { title, description, pdfFile, category, testCases = [], grade = 0 } = req.body || {};
    if (!title || !description || !pdfFile) return res.status(400).json({ message: 'Missing fields' });
    const problems = loadProblems();
    const newProblem = {
        id: problems.length ? problems[problems.length - 1].id + 1 : 1,
        title, description, pdf_file: pdfFile, category, testCases, grade, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
    };
    problems.push(newProblem);
    saveProblems(problems);
    res.status(201).json(newProblem);
};
exports.updateProblem = (req, res) => {
    const id = parseInt(req.params.id, 10);
    const problems = loadProblems();
    const idx = problems.findIndex(p => p.id === id);
    if (idx === -1) return res.status(404).json({ message: 'Not found' });
    problems[idx] = { ...problems[idx], ...req.body, updated_at: new Date().toISOString() };
    saveProblems(problems);
    res.json(problems[idx]);
};
exports.deleteProblem = (req, res) => {
    const id = parseInt(req.params.id, 10);
    let problems = loadProblems();
    const lenBefore = problems.length;
    problems = problems.filter(p => p.id !== id);
    if (problems.length === lenBefore) return res.status(404).json({ message: 'Not found' });
    saveProblems(problems);
    res.json({ message: 'Deleted' });
};

// Submissions
exports.getAllSubmissions = (req, res) => res.json(loadSubmissions());
exports.getSubmissionById = (req, res) => {
    const id = parseInt(req.params.id, 10);
    const s = loadSubmissions().find(x => x.id === id);
    if (!s) return res.status(404).json({ message: 'Not found' });
    res.json(s);
};
exports.updateSubmissionStatus = (req, res) => {
    const id = parseInt(req.params.id, 10);
    const submissions = loadSubmissions();
    const idx = submissions.findIndex(x => x.id === id);
    if (idx === -1) return res.status(404).json({ message: 'Not found' });
    submissions[idx] = { ...submissions[idx], ...req.body, updated_at: new Date().toISOString() };
    saveSubmissions(submissions);
    res.json(submissions[idx]);
};

// Leaderboard
exports.getLeaderboard = (req, res) => {
    const rankings = loadRankings();
    const top = rankings.sort((a,b)=>b.score-a.score).slice(0,10);
    res.json(top);
};

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