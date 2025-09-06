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

export default Submission;