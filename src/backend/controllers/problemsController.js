const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');
const problemsFile = path.join(dataDir, 'problems.json');

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(problemsFile)) fs.writeFileSync(problemsFile, JSON.stringify([]));

function loadProblems() {
    return JSON.parse(fs.readFileSync(problemsFile));
}
function saveProblems(problems) {
    fs.writeFileSync(problemsFile, JSON.stringify(problems, null, 2));
}

exports.getAllProblems = (req, res) => {
    const problems = loadProblems();
    res.json(problems);
};

exports.getProblemById = (req, res) => {
    const id = parseInt(req.params.id, 10);
    const problems = loadProblems();
    const p = problems.find(x => x.id === id);
    if (!p) return res.status(404).json({ message: 'Problem not found' });
    res.json(p);
};

exports.createProblem = (req, res) => {
    const { title, description, pdfFile, category, testCases = [], grade = 0 } = req.body || {};
    if (!title || !description || !pdfFile) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    const problems = loadProblems();
    const newProblem = {
        id: problems.length ? problems[problems.length - 1].id + 1 : 1,
        title, description, pdf_file: pdfFile, category: category || '',
        testCases, grade, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
    };
    problems.push(newProblem);
    saveProblems(problems);
    res.status(201).json(newProblem);
};

exports.updateProblem = (req, res) => {
    const id = parseInt(req.params.id, 10);
    const updates = req.body || {};
    const problems = loadProblems();
    const idx = problems.findIndex(p => p.id === id);
    if (idx === -1) return res.status(404).json({ message: 'Problem not found' });
    const p = problems[idx];
    problems[idx] = { ...p, ...updates, updated_at: new Date().toISOString() };
    saveProblems(problems);
    res.json(problems[idx]);
};

exports.deleteProblem = (req, res) => {
    const id = parseInt(req.params.id, 10);
    let problems = loadProblems();
    const lenBefore = problems.length;
    problems = problems.filter(p => p.id !== id);
    if (problems.length === lenBefore) return res.status(404).json({ message: 'Problem not found' });
    saveProblems(problems);
    res.json({ message: 'Deleted' });
};