import express from 'express';
import axios from 'axios';
import cors from 'cors'; // Import cors

const app = express();
const port = process.env.PORT || 5000;

app.use(cors()); // Use cors middleware
app.use(express.json());

const GEMINI_API_KEY = ''; // Replace with your Gemini API key


app.post('/api/convert', async(req, res) => {
    try {
        const { inputCode, fromLanguage, toLanguage } = req.body;
        const prompt = `Convert the following ${fromLanguage} code to ${toLanguage}, no explaination\n${inputCode}`;

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
                contents: [{ parts: [{ text: prompt }] }],
            }
        );

        const convertedCode = response.data.candidates[0].content.parts[0].text;
        res.json({ convertedCode });
    } catch (error) {
        console.error('Conversion error:', error);
        res.status(500).json({ error: 'Conversion failed' });
    }
});

app.post('/api/debug', async(req, res) => {
    try {
        const { inputCode, language } = req.body;
        const prompt = `Debug the following ${language} code\n${inputCode}`;

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
                contents: [{ parts: [{ text: prompt }] }],
            }
        );

        const debugResult = response.data.candidates[0].content.parts[0].text;
        res.json({ debugResult });
    } catch (error) {
        console.error('Debug error:', error);
        res.status(500).json({ error: 'Debugging failed' });
    }
});

app.post('/api/evaluate', async(req, res) => {
    try {
        const { inputCode, language } = req.body;
        const prompt = `Evaluate the time and space complexity of the following with a short explanation:\n${inputCode}`;

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
                contents: [{ parts: [{ text: prompt }] }],
            }
        );

        const evaluationResult = response.data.candidates[0].content.parts[0].text;
        res.json({ evaluationResult });
    } catch (error) {
        console.error('Evaluation error:', error);
        res.status(500).json({ error: 'Evaluation failed' });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
