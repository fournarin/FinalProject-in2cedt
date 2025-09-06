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
        const response = await fetch('/api/admin/rankings');
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
                        {submission.user} - {submission.problemTitle} - {submission.status}
                    </li>
                ))}
            </ul>

            <h2>User Rankings</h2>
            <ol>
                {rankings.map((ranking, index) => (
                    <li key={ranking.userId}>
                        {index + 1}. {ranking.user} - {ranking.score}
                    </li>
                ))}
            </ol>
        </div>
    );
};

export default Admin;