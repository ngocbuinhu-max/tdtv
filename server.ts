import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Initialize Gemini API Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
} else {
  console.warn("⚠️ Warning: GEMINI_API_KEY environment variable is missing or placeholder. AI features will be disabled.");
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", aiEnabled: !!ai });
});

// Endpoint: Correct a sentence written by the user
app.post("/api/ai/correct-sentence", async (req, res) => {
  if (!ai) {
    return res.status(503).json({ error: "Gemini API key is not configured on the server." });
  }

  const { sentence } = req.body;
  if (!sentence || typeof sentence !== "string" || sentence.trim() === "") {
    return res.status(400).json({ error: "sentence is required." });
  }

  try {
    const prompt = `Analyze the following English sentence written by a student.
We are focusing on teaching the verb "to be" (am, is, are).
Check if they used the verb "to be" correctly.
If they wrote a sentence without "to be" (or translated from Vietnamese incorrectly), explain how they can use "to be".
Provide detailed explanations in Vietnamese, suitable for elementary or middle school students (friendly, encouraging, easy to understand).

Student sentence: "${sentence}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a friendly, encouraging Vietnamese English teacher specializing in teaching the verb 'to be' (am, is, are). Respond in Vietnamese.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isCorrect: {
              type: Type.BOOLEAN,
              description: "Whether the sentence uses am/is/are correctly and is grammatically valid."
            },
            feedback: {
              type: Type.STRING,
              description: "A short, cheering message in Vietnamese. Congratulate them if correct, or say it's okay and encourage them if incorrect."
            },
            explanation: {
              type: Type.STRING,
              description: "Detailed step-by-step grammar explanation in Vietnamese of why this is correct or what was wrong (e.g., explaining subject-verb agreement)."
            },
            correctedSentence: {
              type: Type.STRING,
              description: "The corrected English sentence. If it was already correct, return the original sentence."
            }
          },
          required: ["isCorrect", "feedback", "explanation", "correctedSentence"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    res.json(JSON.parse(text.trim()));
  } catch (error: any) {
    console.error("Error in /api/ai/correct-sentence:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// Endpoint: AI tutor chatbot specialized in "to be"
app.post("/api/ai/chat", async (req, res) => {
  if (!ai) {
    return res.status(503).json({ error: "Gemini API key is not configured on the server." });
  }

  const { message, history } = req.body;
  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "message is required." });
  }

  try {
    // We format history into Gemini contents parts
    const geminiContents: any[] = [];
    
    if (history && Array.isArray(history)) {
      history.forEach((h: any) => {
        geminiContents.push({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.text }]
        });
      });
    }

    geminiContents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: geminiContents,
      config: {
        systemInstruction: `You are a super cute and friendly English teaching assistant mascot named "Bee" 🐝.
Your goal is to help Vietnamese students practice and learn the English verb "to be" (am, is, are).
Rules:
1. Always respond in Vietnamese.
2. Use lots of emojis (especially 🐝, ✨, 🌟, 💡, 📝).
3. Keep your explanation extremely simple, short, and positive, perfect for children.
4. If the user asks a question unrelated to English or grammar, kindly steer them back to practicing English: "Tớ là chú ong Bee chuyên về động từ 'to be' đó! Hãy hỏi tớ những gì liên quan đến tiếng Anh hoặc động từ to be nhé! 🐝"
5. Provide clear, simple example sentences with Vietnamese translations.`,
      }
    });

    const reply = response.text;
    res.json({ reply });
  } catch (error: any) {
    console.error("Error in /api/ai/chat:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// Endpoint: Generate custom fill-in-the-blank questions based on a topic
app.post("/api/ai/generate-questions", async (req, res) => {
  if (!ai) {
    return res.status(503).json({ error: "Gemini API key is not configured on the server." });
  }

  const { topic } = req.body;
  const targetTopic = topic && typeof topic === "string" ? topic.trim() : "animals and hobbies";

  try {
    const prompt = `Generate exactly 3 fill-in-the-blank English questions testing the verb "to be" (am, is, are).
The sentences MUST be based on the topic: "${targetTopic}".
If the topic is in Vietnamese, translate the context of the topic to write the English sentences.
For example, if the topic is "bóng đá" (football), write sentences about football players, footballs, etc.
Each question must replace the "to be" verb with "___".

Ensure the sentences use "am", "is", or "are" in a grammatically simple context.
At least one of the sentences should use a singular subject, one plural, and one can be negative or pronouns like "I".`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a professional quiz maker. Create simple fill-in-the-blank questions about the verb 'to be' (am, is, are) in JSON format.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              description: "Array of exactly 3 questions",
              items: {
                type: Type.OBJECT,
                properties: {
                  sentenceWithBlank: {
                    type: Type.STRING,
                    description: "The sentence with the to-be verb replaced by '___'. Example: 'Lionel Messi ___ an amazing football player.'"
                  },
                  correctOption: {
                    type: Type.STRING,
                    description: "The correct verb to be: 'am', 'is', or 'are' only."
                  },
                  translation: {
                    type: Type.STRING,
                    description: "Vietnamese translation of the complete sentence with the correct verb."
                  },
                  explanation: {
                    type: Type.STRING,
                    description: "A short, kid-friendly explanation in Vietnamese of why this option is correct. Example: 'Lionel Messi là danh từ riêng chỉ một người (số ít) nên chúng ta chọn is!'"
                  }
                },
                required: ["sentenceWithBlank", "correctOption", "translation", "explanation"]
              }
            }
          },
          required: ["questions"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    res.json(JSON.parse(text.trim()));
  } catch (error: any) {
    console.error("Error in /api/ai/generate-questions:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// Setup Vite Dev Server / Static Asset Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite in middleware mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving static production build from /dist...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

startServer();
