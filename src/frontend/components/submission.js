const Submission = () => {
    const [code, setCode] = React.useState('');
    const [result, setResult] = React.useState('');
    const [isShared, setIsShared] = React.useState(false);

    const handleCodeChange = (event) => {
        setCode(event.target.value);
    };

    const handleShareChange = (event) => {
        setIsShared(event.target.checked);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = await fetch('/api/submissions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code, isShared }),
        });

        const data = await response.json();
        setResult(data.result);
    };

    return (
        <div className="submission-container">
            <h2>Submit Your Code</h2>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={code}
                    onChange={handleCodeChange}
                    placeholder="Write your C++ code here..."
                    rows="10"
                    cols="50"
                />
                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={isShared}
                            onChange={handleShareChange}
                        />
                        Share my code with others
                    </label>
                </div>
                <button type="submit">Submit</button>
            </form>
            {result && (
                <div className="result">
                    <h3>Result:</h3>
                    <p>{result}</p>
                </div>
            )}
        </div>
    );
};

// (vanilla JS renderer — attaches to window.renderSubmissionForm(containerId))
window.renderSubmissionForm = function(containerId = 'app') {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = `
        <h2>Submit Your Code</h2>
        <form id="submission-form">
            <textarea id="submission-code" rows="12" style="width:100%" placeholder="Write your C++ code here..."></textarea>
            <div>
                <label><input type="checkbox" id="submission-shared"> Share my code with others</label>
            </div>
            <div style="margin-top:8px;"><button type="submit">Submit</button></div>
        </form>
        <div id="submission-result" style="margin-top:12px;"></div>
    `;
    const form = document.getElementById('submission-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const code = document.getElementById('submission-code').value;
        const isShared = document.getElementById('submission-shared').checked;
        const resultDiv = document.getElementById('submission-result');
        resultDiv.textContent = 'Submitting...';
        try {
            const res = await fetch('/api/submissions/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: 1, problemId: 1, code, isShared })
            });
            const data = await res.json();
            if (res.ok) {
                resultDiv.innerHTML = `<pre>Result: ${data.result}\nDetails: ${JSON.stringify(data.detail, null, 2)}</pre>`;
            } else {
                resultDiv.textContent = data.message || 'Submission failed';
            }
        } catch (err) {
            resultDiv.textContent = 'Network error';
        }
    });
};

export default Submission;