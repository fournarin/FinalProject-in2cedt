const Admin = () => {
    const [problems, setProblems] = React.useState([]);
    const [submissions, setSubmissions] = React.useState([]);
    const [rankings, setRankings] = React.useState([]);

    React.useEffect(() => {
        fetchProblems();
        fetchSubmissions();
        fetchRankings();
    }, []);

    const fetchProblems = async () => {
        const response = await fetch('/api/admin/problems');
        const data = await response.json();
        setProblems(data);
    };

    const fetchSubmissions = async () => {
        const response = await fetch('/api/admin/submissions');
        const data = await response.json();
        setSubmissions(data);
    };

    const fetchRankings = async () => {
        const response = await fetch('/api/admin/leaderboard');
        const data = await response.json();
        setRankings(data);
    };

    const handleDeleteProblem = async (problemId) => {
        await fetch(`/api/admin/problems/${problemId}`, {
            method: 'DELETE',
        });
        fetchProblems();
    };

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <h2>Manage Problems</h2>
            <ul>
                {problems.map(problem => (
                    <li key={problem.id}>
                        {problem.title}
                        <button onClick={() => handleDeleteProblem(problem.id)}>Delete</button>
                    </li>
                ))}
            </ul>

            <h2>Submissions</h2>
            <ul>
                {submissions.map(submission => (
                    <li key={submission.id}>
                        {submission.user_id} - {submission.problem_id} - {submission.result}
                    </li>
                ))}
            </ul>

            <h2>User Rankings</h2>
            <ol>
                {rankings.map((ranking, index) => (
                    <li key={ranking.userId}>
                        {index + 1}. {ranking.user || ranking.userId} - {ranking.score}
                    </li>
                ))}
            </ol>
        </div>
    );
};

export default Admin;

// (vanilla JS renderer — attaches to window.renderAdmin(containerId))
window.renderAdmin = async function(containerId = 'app') {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '<h2>Loading admin...</h2>';
    try {
        const [probsRes, subsRes, ranksRes] = await Promise.all([
            fetch('/api/admin/problems').catch(()=>null),
            fetch('/api/admin/submissions').catch(()=>null),
            fetch('/api/admin/leaderboard').catch(()=>null)
        ]);
        const problems = (probsRes && probsRes.ok) ? await probsRes.json() : [];
        const submissions = (subsRes && subsRes.ok) ? await subsRes.json() : [];
        const ranks = (ranksRes && ranksRes.ok) ? await ranksRes.json() : [];

        container.innerHTML = '<h1>Admin Dashboard</h1>';

        const pSec = document.createElement('section');
        pSec.innerHTML = '<h2>Problems</h2>';
        const pul = document.createElement('ul');
        problems.forEach(p => {
            const li = document.createElement('li');
            li.textContent = p.title;
            const del = document.createElement('button');
            del.textContent = 'Delete';
            del.addEventListener('click', async () => {
                await fetch(`/api/admin/problems/${p.id}`, { method: 'DELETE' });
                window.renderAdmin(containerId);
            });
            li.appendChild(del);
            pul.appendChild(li);
        });
        pSec.appendChild(pul);
        container.appendChild(pSec);

        const sSec = document.createElement('section');
        sSec.innerHTML = '<h2>Submissions</h2>';
        const sul = document.createElement('ul');
        submissions.forEach(s => {
            const li = document.createElement('li');
            li.textContent = `${s.user_id} - ${s.problem_id} - ${s.result}`;
            sul.appendChild(li);
        });
        sSec.appendChild(sul);
        container.appendChild(sSec);

        const rSec = document.createElement('section');
        rSec.innerHTML = '<h2>Leaderboard</h2>';
        const rul = document.createElement('ol');
        ranks.forEach(r => {
            const li = document.createElement('li');
            li.textContent = `${r.user || r.userId} - ${r.score}`;
            rul.appendChild(li);
        });
        rSec.appendChild(rul);
        container.appendChild(rSec);

    } catch (err) {
        container.innerHTML = '<h2>Error loading admin</h2>';
    }
};