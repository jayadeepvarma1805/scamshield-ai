import express from "express";
import { createScamReport } from "../services/report.service.js";

const router = express.Router();

/**
 * POST /api/report
 * Submit a detected scam
 */
router.post("/", async (req, res, next) => {
  try {
    const { url, riskScore, aiSummary } = req.body;

    // minimal required validation
    if (!url || riskScore === undefined || !aiSummary) {
      return res.status(400).json({
        error: "url, riskScore and aiSummary are required",
      });
    }

    const report = await createScamReport(req.body);

    res.status(201).json({
      success: true,
      message: "Scam report saved successfully",
      report,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
