const { OpenAI } = require('openai');
const dotenv = require('dotenv');

dotenv.config();

// Initialize OpenAI conditionally to prevent crashing if the key isn't provided yet
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'dummy_key'
});

const generateAICareerResponse = async (studentContext, userMessage) => {
    try {
        const systemPrompt = `You are a highly supportive and knowledgeable career guidance assistant for the Udaan Path platform. 
You are speaking directly to a student. Keep your answers clear, encouraging, structured, and easy to understand.

Here is the student's current career recommendation profile:
- Recommended Stream: ${studentContext.recommendedStream}
- Suggested Degrees: ${studentContext.degrees.join(', ')}
- Matched Careers: ${studentContext.careers.join(', ')}

Please limit your response length so it's readable in a chat window. Answer the following student question using this context.`;

        // We use gpt-3.5-turbo as a safe default standard for chatbots
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userMessage }
            ],
            temperature: 0.7,
            max_tokens: 300,
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error("OpenAI API Error:", error.message);

        // If the user's OpenAI account is out of credits (429 Too Many Requests/Quota Exceeded)
        // or the API key is completely invalid, gracefully fallback to a mock response so the UI doesn't break
        if (error.status === 429 || error.message.includes('429') || error.message.includes('quota')) {
            return `(Mock AI Response due to OpenAI Quota Limits): That's a great question about the ${studentContext.recommendedStream} stream! Based on your profile and suggested degrees like ${studentContext.degrees[0]}, I highly recommend focusing on foundational subjects and looking into the competitive exams listed below!`;
        }

        throw new Error("Failed to communicate with AI Assistant.");
    }
};

module.exports = {
    generateAICareerResponse
};
