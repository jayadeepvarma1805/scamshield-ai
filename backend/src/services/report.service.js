import ScamReport from "../models/scamReport.model.js";

/**
 * Store a newly detected scam report
 */
export async function createScamReport(data) {
  const report = await ScamReport.create({
    url: data.url,
    category: data.category,
    riskScore: data.riskScore,
    aiSummary: data.aiSummary,
    indicators: data.indicators || [],
    detectedBy: data.detectedBy || "gemini",
    rawPrompt: data.rawPrompt,
    status: data.status || "open",
  });

  return report;
}
