import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { geminiChatModel, isMockMode } from "@/lib/gemini";
import { getMockChatResponse } from "@/lib/mock-responses";
import { checkRateLimit } from "@/lib/rate-limit";
import type { ChatResponse, ApiResponse } from "@/types/api";

const requestSchema = z.object({
  message: z.string(),
  resumeContext: z.any().optional(),
  history: z.array(z.any()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    const identifier = userId ? `ai-chat-${userId}` : "ai-chat-anonymous";

    const limitResult = await checkRateLimit(identifier);
    if (!limitResult.success) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please wait a minute." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid request payload" },
        { status: 400 }
      );
    }

    const { message, resumeContext, history = [] } = parsed.data;

    if (isMockMode() || !process.env.GEMINI_API_KEY) {
      const apiResponse: ApiResponse<ChatResponse> = {
        success: true,
        data: getMockChatResponse(message),
      };
      return NextResponse.json(apiResponse);
    }

    // Prepare system instructions and message thread for Gemini
    const systemPrompt = `You are "ResumeAI Assistant", an elite AI career coach and multilingual resume specialist.
You are fluent in English, Telugu, Hindi, French, Japanese, and other major languages.
You will converse with the user in the language they write in (e.g. if they write in Telugu, reply in Telugu; if they write in Hindi, reply in Hindi).

Current Candidate Resume Data:
${resumeContext ? JSON.stringify(resumeContext, null, 2) : "No resume data entered yet."}

Conversation History (for context):
${history.slice(-5).map(h => `${h.role === "user" ? "Candidate" : "Assistant"}: ${h.content}`).join("\n")}

Guidelines:
1. Provide actionable, helpful, and concise advice about resume structure, impact verbs, metrics, project descriptions, or career guidance.
2. Be extremely polite, professional, and supportive.
3. If asked to rewrite a section or bullet, provide direct, ready-to-copy improvements.
4. Conclude with a helpful question or a single clear next step.

User Message: "${message}"`;

    const result = await geminiChatModel.generateContent(systemPrompt);
    const replyText = result.response.text();

    // Detect language simply based on the prompt or let Gemini default
    let detectedLanguage = "en";
    if (/[\u0C00-\u0C7F]/.test(message)) detectedLanguage = "te";
    else if (/[\u0900-\u097F]/.test(message)) detectedLanguage = "hi";
    else if (/[\u00C0-\u00FF]/.test(message)) detectedLanguage = "fr";
    else if (/[\u3040-\u30FF\u4E00-\u9FFF]/.test(message)) detectedLanguage = "ja";

    const data: ChatResponse = {
      reply: replyText.trim(),
      language: detectedLanguage,
    };

    const apiResponse: ApiResponse<ChatResponse> = {
      success: true,
      data,
    };

    return NextResponse.json(apiResponse);
  } catch (error: any) {
    console.error("Error in ai-chat:", error);
    const apiResponse: ApiResponse<ChatResponse> = {
      success: true,
      data: getMockChatResponse(""),
    };
    return NextResponse.json(apiResponse);
  }
}
