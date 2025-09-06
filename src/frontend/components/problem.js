const Problem = () => {
    const [problems, setProblems] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        fetch('/api/problems')
            .then(response => response.json())
            .then(data => {
                setProblems(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching problems:', error);
                setLoading(false);
            });
    }, []);

    const downloadPDF = (pdfUrl) => {
        window.open(pdfUrl, '_blank');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="problem-list">
            <h2>Programming Problems</h2>
            <ul>
                {problems.map(problem => (
                    <li key={problem.id}>
                        <h3>{problem.title}</h3>
                        <p>{problem.description}</p>
                        <button onClick={() => downloadPDF(problem.pdfUrl)}>Download PDF</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Problem;