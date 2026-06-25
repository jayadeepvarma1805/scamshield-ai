
import ScamReport from "../models/scamReport.model.js";

/**
 * Get latest reported scams
 */
export async function getRecentThreats(limit = 20) {
  return ScamReport.find()
    .sort({ createdAt: -1 })
    .limit(limit);
}

/**
 * Search by URL / domain / keyword
 */
export async function searchThreat(query) {
  const regex = new RegExp(query, "i");

  return ScamReport.find({
    $or: [
      { url: regex },
      { category: regex },
      { aiSummary: regex },
      { indicators: regex }
    ]
  }).sort({ createdAt: -1 });
}

/**
 * Check exact URL match
 */
export async function findThreatByUrl(url) {
  return ScamReport.findOne({ url });
}