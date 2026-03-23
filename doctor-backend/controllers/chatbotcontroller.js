const axios = require('axios');
const { logActivity } = require('../utils/auditLogger');

exports.chat = async (req, res) => {
    try {
        const { message, history = [], context } = req.body;

        // Log the query attempt (optional, keep it clean)
        await logActivity(req, 'CHATBOT_QUERY', 'CHATBOT', null, { message });

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({
                success: false,
                message: "GEMINI_API_KEY missing in .env file"
            });
        }

        const systemPrompt = `
You are a helpful Dermatology AI assistant.

CONTEXT (User's latest scan results):
Condition: ${context?.condition || 'N/A'}
Confidence: ${context?.confidence || 'N/A'}%
Risk Level: ${context?.risk || 'N/A'}
Description: ${context?.description || 'N/A'}
Suggested Action: ${context?.action || 'N/A'}

CRITICAL RULES:
- If the question is NOT about dermatology, skin conditions, or skin health, you MUST respond ONLY with: "I am sorry, the message is not related to dermatology."
- Do NOT answer questions about general health, other body parts, geography, math, or any non-skin topics.
- For valid dermatology questions, make responses simple, human-readable, and brief.
- Do NOT give a final diagnosis.
- Do NOT prescribe medicine.
- Be professional and clinical.
- Suggest monitoring or diagnostic steps only.
- Always remind this is AI assistance, not final medical advice.
- give more content about the question.
- Always be crisp and clear.
`;

        // Convert history to Gemini format
        const contents = history.map(h => ({
            role: h.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: h.content }]
        }));

        // Add current user message with system prompt
        contents.push({
            role: 'user',
            parts: [{ text: `${systemPrompt}\n\nUser Question: ${message}` }]
        });

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents,
                generationConfig: {
                    temperature: 0.4,
                    maxOutputTokens: 500
                },
                safetySettings: [
                    {
                        category: "HARM_CATEGORY_HARASSMENT",
                        threshold: "BLOCK_NONE"
                    },
                    {
                        category: "HARM_CATEGORY_HATE_SPEECH",
                        threshold: "BLOCK_NONE"
                    },
                    {
                        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                        threshold: "BLOCK_NONE"
                    },
                    {
                        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                        threshold: "BLOCK_NONE"
                    }
                ]
            },
            {
                headers: { 'Content-Type': 'application/json' }
            }
        );

        const reply =
            response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

        // Handle blocked or empty responses
        if (!reply) {
            const finishReason = response.data?.candidates?.[0]?.finishReason;
            if (finishReason === 'SAFETY' || finishReason === 'RECITATION') {
                return res.json({
                    success: true,
                    reply: "I am sorry, the message is not related to dermatology."
                });
            }
            throw new Error("Empty response from Gemini");
        }

        res.json({
            success: true,
            reply
        });

    } catch (error) {
        console.error(
            "Gemini Error:",
            error.response ? error.response.data : error.message
        );

        // Check if it's a rate limit error
        if (error.response?.data?.error?.code === 429) {
            return res.status(200).json({
                success: true,
                reply: "The AI assistant is temporarily unavailable due to high usage. Please try again in a few minutes or contact support if this persists."
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to connect with Gemini AI",
            error: error.response ? error.response.data : error.message
        });
    }
};
