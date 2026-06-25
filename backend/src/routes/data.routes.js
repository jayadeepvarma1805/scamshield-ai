import express from "express";
import {
  getRecentThreats,
  searchThreat,
  findThreatByUrl,
} from "../services/data.service.js";

const router = express.Router();

router.get("/recent", async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 20;

    const data = await getRecentThreats(limit);

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

router.get("/search", async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ error: "query param q is required" });
    }

    const results = await searchThreat(q);

    res.json({ success: true, results });
  } catch (err) {
    next(err);
  }
});

router.get("/url", async (req, res, next) => {
  try {
    const { value } = req.query;

    if (!value) {
      return res.status(400).json({ error: "value param is required" });
    }

    const result = await findThreatByUrl(value);

    res.json({ success: true, result });
  } catch (err) {
    next(err);
  }
});

export default router;
