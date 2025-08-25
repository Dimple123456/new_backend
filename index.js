const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { GoogleGenAI, Modality } = require("@google/genai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// ✅ Root route (for testing backend)
app.get("/", (req, res) => {
  res.send("✅ Backend is running successfully!");
});

// ✅ Image Generate API
app.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: prompt,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    let imageBase64 = null;
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        imageBase64 = part.inlineData.data;
      }
    }

    res.json({ imageUrl: imageBase64 });
  } catch (error) {
    console.error("Error generating:", error);
    res.status(500).json({ error: "Image generation failed." });
  }
});

// ✅ Dynamic port for Render
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
