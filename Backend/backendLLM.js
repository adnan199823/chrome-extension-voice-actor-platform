const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_API_KEY = "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";
const MODEL_NAME = "mistralai/mistral-7b-instruct";

app.post('/llm', async (req, res) => {
    try {
        const prompt = req.body.prompt;
        console.log(prompt)

        const response = await axios.post(
            OPENROUTER_API_URL,
            {
                model: MODEL_NAME,
                messages: [
                    { role: "user", content: prompt }
                ]
            },
            {
                headers: {
                    "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const llmResponse = response.data.choices[0].message.content;
        console.log(llmResponse);

        res.json({ response: llmResponse }); 

    } catch (error) {
        console.error("Full error:", error.response?.data || error.message);

        if (error.response?.status === 503) {
            res.status(503).json({ 
                error: "Model is loading",
                details: error.response.data 
            });
        } else {
            res.status(500).json({ 
                error: "LLM request failed",
                details: error.response?.data || error.message
            });
        }
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
