import express from "express";
import { analyzeUrlWithAI } from "../services/ai.service.js";

const router = express.Router();

router.post("/analyze-url", async (req, res) => {
  console.log("==== /analyze-url HIT ====");
  console.log("BODY:", req.body);
  console.log("HEADERS:", req.headers);

  try {
    const { url, prompt } = req.body;

    if (!url || !prompt) {
      console.error("❌ Missing fields:", { url, prompt });
      return res.status(400).json({
        success: false,
        error: "url and prompt are required",
      });
    }

    console.log("➡️ Calling analyzeUrlWithAI...");
    const output = await analyzeUrlWithAI(url, prompt);

    console.log("✅ AI output saved:", output._id);

    return res.json({
      success: true,
      analysis: output,
    });
  } catch (err) {
    console.error("🔥 ROUTE ERROR:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Server error",
    });
  }
});


export default router;
