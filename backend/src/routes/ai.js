import express from 'express';
import dotenv from 'dotenv';
import { requireAuth } from '@clerk/express';
import Produce from '../models/Produce.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const router = express.Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;
const geminiModel = genAI ? genAI.getGenerativeModel({ model: GEMINI_MODEL }) : null;

async function getBatchContext(batchId) {
  if (!batchId) return null;
  try {
    const batch = await Produce.findOne({ batchId }).lean();
    if (!batch) return null;
    return {
      batchId: batch.batchId,
      origin: batch.origin,
      currentOwner: batch.currentOwner,
      quantityKg: batch.quantityKg,
      qualityGrade: batch.qualityGrade,
      moisture: batch.moisture,
      createdAt: batch.createdAt,
    };
  } catch {
    return null;
  }
}

function buildSystemPrompt() {
  return `You are AgriChain Copilot for an agriculture traceability dApp.
- Answer concisely with clear, actionable steps.
- Use only provided context (batch data, blockchain events, ML insights).
- If data is missing, say what is needed.
- When explaining a transaction, include roles, batchId, qty, and price if present.
- When generating a document, return short, clean Markdown.`;
}

function buildUserPrompt({ messages, batchSummary }) {
  const context = batchSummary ? `\n\nContext Batch: ${JSON.stringify(batchSummary)}\n\n` : '\n\n';
  const lastUserMsg = messages?.filter(m => m.role === 'user').slice(-1)[0]?.content || '';
  return `${lastUserMsg}${context}`;
}

async function callGemini({ system, user }) {
  if (!geminiModel) return 'AI service key is not configured.';
  const prompt = `${system}\n\nUser:\n${user}`;
  const result = await geminiModel.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.2 }
  });
  return result?.response?.text() || 'No answer.';
}

// Build auth middleware (fallback to open if CLERK_SECRET_KEY missing in dev)
let authMiddleware;
if (process.env.CLERK_SECRET_KEY) {
  authMiddleware = requireAuth();
} else {
  console.warn('[AI ROUTE] CLERK_SECRET_KEY not set. /api/ai/chat is NOT protected in this environment.');
  authMiddleware = (req, _res, next) => next();
}

// POST /api/ai/chat
router.post('/chat', authMiddleware, async (req, res) => {
  try {
    const { messages = [], batchId } = req.body || {};
    const batchSummary = await getBatchContext(batchId);
    const system = buildSystemPrompt();
    const user = buildUserPrompt({ messages, batchSummary });
    const answer = await callGemini({ system, user });
    res.json({ answer, batchSummary });
  } catch (err) {
    console.error('AI chat error:', err?.response?.data || err.message);
    res.status(500).json({ error: 'AI_SERVICE_FAILED', detail: err?.response?.data || err.message });
  }
});

export default router;
