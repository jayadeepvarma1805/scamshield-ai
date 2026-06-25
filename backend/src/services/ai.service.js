import fetch from "node-fetch";
import AIThreatAnalysis from "../models/aiThreatAnalysis.model.js";

const TRUSTED_DOMAINS = [
  "youtube.com",
  "www.youtube.com",
  "instagram.com",
  "www.instagram.com",
  "facebook.com",
  "www.facebook.com",
  "google.com",
  "www.google.com",
  "gmail.com",
  "www.gmail.com",
  "x.com",
  "twitter.com",
  "www.twitter.com",
  "linkedin.com",
  "www.linkedin.com",
  "amazon.com",
  "www.amazon.com",
  "microsoft.com",
  "www.microsoft.com",
  "apple.com",
  "www.apple.com",
  "github.com",
  "www.github.com",
];

const LMSTUDIO_URL = "http://127.0.0.1:1234/v1/chat/completions";
const MODEL = "liquid/lfm2.5-1.2b";

/**
 * Fetch webpage content safely
 */
async function fetchUrl(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "ScamShieldBot/1.0" },
      signal: controller.signal,
    });

    if (!res.ok) {
      console.error("❌ Fetch failed:", res.status);
      return { error: `FETCH_ERROR_${res.status}` };
    }

    const text = await res.text();
    return { html: text };
  } catch (err) {
    console.error("❌ Fetch exception:", err.message);
    return { error: "FETCH_EXCEPTION" };
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Extract JSON safely
 */
function extractJSON(text) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON in AI output");
  return JSON.parse(match[0]);
}

/**
 * Analyze URL using LM Studio REST
 */
export async function analyzeUrlWithAI(url, customPrompt) {
  console.log("==== AI SERVICE START ====");
  console.log("URL:", url);
  console.log("PROMPT LENGTH:", customPrompt?.length);

  // ✅ TRUSTED DOMAIN SHORT CIRCUIT
  try {
    const parsedUrl = new URL(url);
    const host = parsedUrl.hostname.toLowerCase();

    if (TRUSTED_DOMAINS.includes(host)) {
      console.log("🟢 Trusted domain detected — skipping LLM:", host);

      return await AIThreatAnalysis.create({
        url,
        riskScore: 5,
        threatType: "safe",
        summary: "Known legitimate website.",
        consequences: [],
        indicators: [],
        confidence: 0.9,
        rawResponse: "TRUSTED_DOMAIN_ALLOWLIST",
        aiModel: "static-allowlist",
      });
    }
  } catch (err) {
    console.warn("⚠️ Invalid URL format:", url);
  }

  // 🌐 Fetch website
  const fetchResult = await fetchUrl(url);

  if (fetchResult.error) {
    console.warn("⚠️ Page not accessible:", fetchResult.error);

    return await AIThreatAnalysis.create({
      url,
      riskScore: 60,
      threatType: "unknown",
      summary: `Website could not be fetched (${fetchResult.error}). Possibly blocked or offline.`,
      consequences: ["Unable to verify site content"],
      indicators: ["Target server unreachable or returned error"],
      confidence: 0.4,
      rawResponse: fetchResult.error,
      aiModel: MODEL,
    });
  }

  const pageContent = fetchResult.html;
  console.log("Fetched page length:", pageContent.length);

  const trimmed = pageContent.slice(0, 12000);

  const finalPrompt = `
${customPrompt}

Fetched Data:
${trimmed}
`;

  console.log("➡️ Sending to LM Studio...");

  const response = await fetch(LMSTUDIO_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: "user", content: finalPrompt }],
      temperature: 0.2,
    }),
  });

  console.log("LM STATUS:", response.status);

  if (!response.ok) {
    const err = await response.text();
    console.error("❌ LM ERROR:", err);
    throw new Error(`LM Studio error: ${err}`);
  }

  const data = await response.json();
  console.log("LM RAW:", JSON.stringify(data).slice(0, 400));

  const rawText = data.choices?.[0]?.message?.content;

  if (!rawText) {
    throw new Error("No message content from LM Studio");
  }

  const parsed = extractJSON(rawText);
  console.log("Parsed JSON:", parsed);

  const analysis = await AIThreatAnalysis.create({
    url,
    riskScore: Math.round(parsed.riskScore),
    threatType: parsed.threatType,
    summary: parsed.summary,
    consequences: parsed.consequences || [],
    indicators: parsed.indicators || [],
    confidence: parsed.confidence,
    rawResponse: rawText,
    aiModel: MODEL,
  });

  console.log("Saved Mongo ID:", analysis._id);

  return analysis;
}
