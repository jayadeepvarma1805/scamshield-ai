import mongoose from "mongoose";

const scamReportSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      index: true,
    },

    category: {
      type: String,
      enum: [
        "phishing",
        "malware",
        "fake-job",
        "crypto-scam",
        "impersonation",
        "fraud",
        "unknown",
      ],
      default: "unknown",
    },

    riskScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },

    aiSummary: {
      type: String,
      required: true,
    },

    indicators: [
      {
        type: String,
      },
    ],

    detectedBy: {
      type: String,
      default: "gemini",
    },

    rawPrompt: {
      type: String,
    },

    status: {
      type: String,
      enum: ["open", "verified", "false-positive"],
      default: "open",
    },

    reportedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

export default mongoose.model("ScamReport", scamReportSchema);