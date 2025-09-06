const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');
const usersFile = path.join(dataDir, 'users.json');

// Ensure data directory & file
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}
if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, JSON.stringify([]));
}

let sessions = {}; // in-memory token -> userId

function loadUsers() {
    const raw = fs.readFileSync(usersFile);
    return JSON.parse(raw);
}
function saveUsers(users) {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

exports.register = (req, res) => {
    const { firstName, lastName, email, studentId, password, profilePicture } = req.body || {};

    if (!firstName || !lastName || !email || !studentId || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    if (!/^\d{10}$/.test(studentId)) {
        return res.status(400).json({ message: 'Student ID must be exactly 10 digits' });
    }

    const users = loadUsers();
    if (users.find(u => u.email === email)) {
        return res.status(409).json({ message: 'Email already registered' });
    }
    if (users.find(u => u.student_id === studentId)) {
        return res.status(409).json({ message: 'Student ID already registered' });
    }

    const newUser = {
        id: users.length ? users[users.length - 1].id + 1 : 1,
        first_name: firstName,
        last_name: lastName,
        email,
        password, // NOTE: storing plain text here for simplicity; in production hash passwords
        student_id: studentId,
        profile_picture: profilePicture || '',
        created_at: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);

    return res.status(201).json({ message: 'User registered' });
};

exports.login = (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) {
        return res.status(400).json({ message: 'Missing email or password' });
    }
    const users = loadUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = Math.random().toString(36).slice(2);
    sessions[token] = user.id;
    return res.json({ token, user: { id: user.id, first_name: user.first_name, last_name: user.last_name, email: user.email } });
};

exports.getProfile = (req, res) => {
    const auth = req.headers['authorization'] || '';
    const match = auth.match(/^Bearer (.+)$/);
    if (!match) return res.status(401).json({ message: 'Missing token' });
    const token = match[1];
    const userId = sessions[token];
    if (!userId) return res.status(401).json({ message: 'Invalid token' });
    const users = loadUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { password, ...rest } = user;
    return res.json(rest);
};