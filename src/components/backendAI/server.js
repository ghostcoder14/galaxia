
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
}));
app.use(express.json({ limit: "10kb" }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.post("/api/space-assistant", async (req, res) => {
  try {
    const { message } = req.body;

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        error: "Please enter a question.",
      });
    }

    if (message.length > 2000) {
      return res.status(400).json({
        error: "Your question must be under 2000 characters.",
      });
    }

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message.trim(),
      config: {
        systemInstruction: `
          You are Galaxia's Space AI Assistant.
          You help users explore astronomy, planets, stars,
          galaxies, cosmology, satellites, and space missions.
          Explain scientific concepts clearly and accurately.
          Keep answers conversational and beginner-friendly.
          If you are unsure about a fact, say so.
          Do not claim to have live astronomical data unless
          a live data source is actually connected.
        `,
        maxOutputTokens: 700,
      },
    });

    return res.json({
      reply: result.text || "I couldn't generate a response. Try again.",
    });
  } catch (error) {
    console.error("Gemini API error:", error.message);

    return res.status(500).json({
      error: "The Space AI Assistant is temporarily unavailable.",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Galaxia AI backend running on port ${PORT}`);
});
