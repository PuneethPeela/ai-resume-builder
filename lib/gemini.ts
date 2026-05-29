import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  console.warn("⚠️  GEMINI_API_KEY not set — AI features will use mock responses");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    temperature: 0.7,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 2048,
    responseMimeType: "application/json",
  },
});

export const geminiChatModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    temperature: 0.8,
    topP: 0.95,
    maxOutputTokens: 1024,
  },
});

/**
 * Check if mock AI mode is enabled.
 * Used for demo reliability when Gemini rate-limits.
 */
export function isMockMode(): boolean {
  return process.env.NEXT_PUBLIC_MOCK_AI === "true";
}
