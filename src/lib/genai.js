import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = "AIzaSyCGyVS1oF8U6uWLZnROa4Hwl6s5IBr2Tb4";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export const GenAI = async (prompt) => {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    try {
        const response = await model.generateContent(prompt);
        return response.response.text();
    } catch (error) {
        console.error("Error generating content:", error);
        return null;
    }
}

