const Dashboard = () => {
    // State to hold user-specific information
    const [userInfo, setUserInfo] = useState(null);
    const [rankings, setRankings] = useState([]);

    useEffect(() => {
        // Fetch user information and rankings from the backend
        const fetchData = async () => {
            try {
                const userResponse = await fetch('/api/user/info');
                const rankingsResponse = await fetch('/api/rankings');
                
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
                {rankings.map((rank, index) => (
                    <li key={index}>{rank.username}: {rank.score}</li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;