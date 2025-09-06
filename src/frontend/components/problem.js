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

// (vanilla JS renderer — attaches to window.renderProblems(containerId))
window.renderProblems = async function(containerId = 'app') {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '<h2>Loading problems...</h2>';
    try {
        const res = await fetch('/api/problems');
        const problems = await res.json();
        if (!problems || !problems.length) {
            container.innerHTML = '<h2>No problems yet</h2>';
            return;
        }
        const ul = document.createElement('ul');
        problems.forEach(p => {
            const li = document.createElement('li');
            const h3 = document.createElement('h3');
            h3.textContent = p.title;
            const pdesc = document.createElement('p');
            pdesc.textContent = p.description;
            const btn = document.createElement('button');
            btn.textContent = 'Download PDF';
            btn.addEventListener('click', () => {
                window.open(p.pdf_file || p.pdfFile || '#', '_blank');
            });
            li.appendChild(h3);
            li.appendChild(pdesc);
            li.appendChild(btn);
            ul.appendChild(li);
        });
        container.innerHTML = '<h2>Programming Problems</h2>';
        container.appendChild(ul);
    } catch (err) {
        container.innerHTML = '<h2>Error loading problems</h2>';
    }
};

export default Problem;