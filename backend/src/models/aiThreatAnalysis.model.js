import mongoose from "mongoose";

const aiThreatAnalysisSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      index: true,
    },

    riskScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },

    threatType: {
      type: String,
      enum: [
        "phishing",
        "malware",
        "scam",
        "fraud",
        "impersonation",
        "crypto-scam",
        "safe",
        "unknown",
      ],
      required: true,
    },

    consequences: [
      {
        type: String,
      },
    ],

    indicators: [
      {
        type: String,
      },
    ],

    summary: {
      type: String,
      required: true,
    },

    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.7,
    },

    aiModel: {
      type: String,
      default: "gemini-1.5-pro",
    },

    rawResponse: {
      type: String,
    },

    scannedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

export default mongoose.model("AIThreatAnalysis", aiThreatAnalysisSchema);
