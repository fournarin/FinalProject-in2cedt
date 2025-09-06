const fs = require('fs');
const path = require('path');
const grader = require('../services/grader');

const dataDir = path.join(__dirname, '../data');
const problemsFile = path.join(dataDir, 'problems.json');
const submissionsFile = path.join(dataDir, 'submissions.json');

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(problemsFile)) fs.writeFileSync(problemsFile, JSON.stringify([]));
if (!fs.existsSync(submissionsFile)) fs.writeFileSync(submissionsFile, JSON.stringify([]));

function loadProblems() { return JSON.parse(fs.readFileSync(problemsFile)); }
function loadSubmissions() { return JSON.parse(fs.readFileSync(submissionsFile)); }
function saveSubmissions(s) { fs.writeFileSync(submissionsFile, JSON.stringify(s, null, 2)); }

exports.submitCode = (req, res) => {
    const auth = (req.headers['authorization'] || '').match(/^Bearer (.+)$/);
    const token = auth ? auth[1] : null;
    // you can map token -> user id if session exists. fallback use body.userId
    const { userId = null, problemId, code, isShared = false } = req.body || {};
    if (!problemId || !code) return res.status(400).json({ message: 'Missing problemId or code' });

    const problems = loadProblems();
    const problem = problems.find(p => p.id === Number(problemId));
    const testCases = (problem && problem.testCases) ? problem.testCases : [];

    // grade using grader service (placeholder)
    const results = grader.gradeSubmission(code, testCases); // [{case:1,result:'P'},{...}]
    const summary = results.map(r => r.result).join('');

    const submissions = loadSubmissions();
    const newSubmission = {
        id: submissions.length ? submissions[submissions.length - 1].id + 1 : 1,
        user_id: userId || 0,
        token_owner: token || '',
        problem_id: Number(problemId),
        code,
        result: summary,
        detail: results,
        is_shared: !!isShared,
        created_at: new Date().toISOString()
    };
    submissions.push(newSubmission);
    saveSubmissions(submissions);

    res.status(201).json({ submissionId: newSubmission.id, result: summary, detail: results });
};

exports.getSubmissionResults = (req, res) => {
    const submissionId = parseInt(req.params.submissionId || req.params.id, 10);
    const submissions = loadSubmissions();
    const s = submissions.find(x => x.id === submissionId);
    if (!s) return res.status(404).json({ message: 'Submission not found' });
    res.json(s);
};

exports.getUserSubmissions = (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    const submissions = loadSubmissions();
    const filtered = submissions.filter(s => s.user_id === userId || s.token_owner === (req.headers['authorization'] || '').replace('Bearer ',''));
    res.json(filtered);
};

exports.deleteSubmission = (req, res) => {
    const submissionId = parseInt(req.params.submissionId || req.params.id, 10);
    let submissions = loadSubmissions();
    const lenBefore = submissions.length;
    submissions = submissions.filter(s => s.id !== submissionId);
    if (submissions.length === lenBefore) return res.status(404).json({ message: 'Submission not found' });
    saveSubmissions(submissions);
    res.json({ message: 'Deleted' });
};

// NEW: คืน submissions ที่ถูกแชร์สาธารณะ
exports.getSharedSubmissions = (req, res) => {
    const submissions = loadSubmissions();
    const shared = submissions.filter(s => s.is_shared);
    // hide full code in list; provide metadata
    const mapped = shared.map(s => ({ id: s.id, user_id: s.user_id, problem_id: s.problem_id, result: s.result, created_at: s.created_at }));
    res.json(mapped);
};

// NEW: คืนโค้ดต้นฉบับของ submission ถ้าเป็น public (is_shared) หรือเจ้าของ/แอดมิน
exports.getSubmissionSource = (req, res) => {
    const submissionId = parseInt(req.params.submissionId || req.params.id, 10);
    const submissions = loadSubmissions();
    const s = submissions.find(x => x.id === submissionId);
    if (!s) return res.status(404).json({ message: 'Submission not found' });
    if (!s.is_shared) {
        return res.status(403).json({ message: 'This submission is not shared' });
    }
    res.json({ id: s.id, code: s.code, result: s.result, detail: s.detail });
};