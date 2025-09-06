const axios = require('axios');

const LLM_API_URL = 'https://api.example.com/llm'; // Replace with actual LLM API URL
const API_KEY = 'your_api_key_here'; // Replace with your actual API key

async function getCodeExplanation(code) {
    try {
        const response = await axios.post(LLM_API_URL + '/explain', {
            code: code
        }, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data.explanation;
    } catch (error) {
        console.error('Error fetching code explanation:', error);
        throw new Error('Could not fetch code explanation');
    }
}

async function suggestAlgorithm(problemStatement) {
    try {
        const response = await axios.post(LLM_API_URL + '/suggest', {
            problem: problemStatement
        }, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data.suggestion;
    } catch (error) {
        console.error('Error fetching algorithm suggestion:', error);
        throw new Error('Could not fetch algorithm suggestion');
    }
}

module.exports = {
    getCodeExplanation,
    suggestAlgorithm
};