const Dashboard = () => {
    // State to hold user-specific information
    const [userInfo, setUserInfo] = useState(null);
    const [rankings, setRankings] = useState([]);

    useEffect(() => {
        // Fetch user information and rankings from the backend
        const fetchData = async () => {
            try {
                const userResponse = await fetch('/api/auth/profile');
                const rankingsResponse = await fetch('/api/admin/leaderboard');
                
                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    setUserInfo(userData);
                }

                if (rankingsResponse.ok) {
                    const rankingsData = await rankingsResponse.json();
                    setRankings(rankingsData);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="dashboard">
            <h1>Welcome, {userInfo ? userInfo.name : 'User'}!</h1>
            <h2>Your Rankings</h2>
            <ul>
                {rankings.length === 0 ? (
                    <li>No rankings yet</li>
                ) : (
                    rankings.map((rank, index) => (
                        <li key={index}>{rank.user || rank.userId}: {rank.score}</li>
                    ))
                )}
            </ul>
        </div>
    );
};

// (vanilla JS renderer — attaches to window.renderDashboard(containerId))
window.renderDashboard = async function(containerId = 'app') {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '<h2>Loading dashboard...</h2>';
    try {
        const userRes = await fetch('/api/auth/profile', { headers: {} }).catch(()=>null);
        let user = null;
        if (userRes && userRes.ok) user = await userRes.json();
        const rankRes = await fetch('/api/admin/leaderboard').catch(()=>null);
        const ranks = (rankRes && rankRes.ok) ? await rankRes.json() : [];
        container.innerHTML = `<h1>Welcome, ${user ? (user.first_name || user.name) : 'User'}!</h1>
            <h2>Your Rankings</h2>
            <ul id="ranking-list"></ul>`;
        const ul = document.getElementById('ranking-list');
        if (!ranks.length) ul.innerHTML = '<li>No rankings yet</li>';
        else ranks.forEach(r => {
            const li = document.createElement('li');
            li.textContent = `${r.user || r.userId}: ${r.score}`;
            ul.appendChild(li);
        });
    } catch (err) {
        container.innerHTML = '<h2>Error loading dashboard</h2>';
    }
};

export default Dashboard;