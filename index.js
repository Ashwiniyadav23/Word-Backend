const express = require("express");
const cors = require("cors");
require("dotenv").config();
const OpenAI = require("openai");

const app = express();
app.use(cors());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ Root route to confirm API is live
app.get("/", (req, res) => {
  res.send("✅ Word API is working!");
});

app.get("/api/word", async (req, res) => {
  try {
    const level = req.query.level || "beginner";

    const prompt = `
    Provide one English "Word of the Day" suitable for a ${level} learner with the following details:

    1. Word: (just the word)
    2. Meaning: (a clear and concise meaning suitable for a ${level} learner)
    3. Example sentence: (a sentence using the word naturally)

    Then, create 3 multiple-choice questions (MCQs) that test the meaning of the word.
    Each question should have:
    - The question text
    - Four answer options labeled (A), (B), (C), (D)

    Do NOT include the correct answer in the output.

    Format your output exactly like this, without any extra explanation:

    Word: <word>
    Meaning: <meaning>
    Example sentence: <example sentence>

    Quiz:
    1. <Question text>? (A) <option1> (B) <option2> (C) <option3> (D) <option4>
    2. <Question text>? (A) <option1> (B) <option2> (C) <option3> (D) <option4>
    3. <Question text>? (A) <option1> (B) <option2> (C) <option3> (D) <option4>
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    });

    const text = response.choices[0].message.content;
    res.json({ wordData: text });
  } catch (error) {
    console.error("OpenAI API error:", error.message);
    res.status(500).json({ error: "Failed to fetch word from OpenAI" });
  }
});

// ✅ For Vercel deployment (do not use app.listen)
module.exports = app;
