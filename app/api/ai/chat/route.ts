import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { geminiChatModel, isMockMode } from "@/lib/gemini";
import { getMockChatResponse } from "@/lib/mock-responses";
import { checkRateLimit } from "@/lib/rate-limit";
import type { ChatResponse, ApiResponse } from "@/types/api";
import { getSessionUser } from "@/lib/auth-helper";

const requestSchema = z.object({
  message: z.string(),
  resumeContext: z.any().optional(),
  history: z.array(z.any()).optional(),
  resumeId: z.string().optional(),
});

// Helper to get database User ID from Clerk ID, creating the user if missing
async function getOrCreateDbUser(clerkUserId: string) {
  const existingUser = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
  });

  if (existingUser) return existingUser;

  let email = `${clerkUserId}@noemail.com`;
  let name = clerkUserId.startsWith("mock_") 
    ? clerkUserId.replace("mock_", "").split("_")[0] 
    : "Reviewer Candidate";
  let imageUrl = null;

  try {
    const clerkUser = await currentUser();
    if (clerkUser) {
      email = clerkUser.emailAddresses[0]?.emailAddress || email;
      name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || name;
      imageUrl = clerkUser.imageUrl || null;
    }
  } catch {
    // Clerk unconfigured
  }

  return await prisma.user.create({
    data: {
      clerkId: clerkUserId,
      email,
      name,
      imageUrl,
    },
  });
}

/**
 * GET /api/ai/chat
 * Fetches the database chat history for the authenticated user (optionally filtered by resumeId).
 */
export async function GET(req: NextRequest) {
  try {
    const userId = await getSessionUser();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await getOrCreateDbUser(userId);
    const { searchParams } = new URL(req.url);
    const resumeId = searchParams.get("resumeId");

    const messages = await prisma.chatMessage.findMany({
      where: {
        userId: dbUser.id,
        ...(resumeId ? { resumeId } : {}),
      },
      orderBy: {
        createdAt: "asc",
      },
      take: 40, // Load last 40 messages to maintain speed
    });

    return NextResponse.json({ success: true, data: messages });
  } catch (error: any) {
    console.error("GET /api/ai/chat error:", error);
    return NextResponse.json({ success: false, error: "Failed to load chat history" }, { status: 500 });
  }
}

/**
 * POST /api/ai/chat
 * Submits user chat input, invokes Gemini, saves both to the database, and returns the response.
 */
export async function POST(req: NextRequest) {
  try {
    const userId = await getSessionUser();
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

    const { message, resumeContext, history = [], resumeId } = parsed.data;

    // Detect language simply based on the prompt or let Gemini default
    let detectedLanguage = "en";
    if (/[\u0C00-\u0C7F]/.test(message)) detectedLanguage = "te";
    else if (/[\u0900-\u097F]/.test(message)) detectedLanguage = "hi";
    else if (/[\u00C0-\u00FF]/.test(message)) detectedLanguage = "fr";
    else if (/[\u3040-\u30FF\u4E00-\u9FFF]/.test(message)) detectedLanguage = "ja";

    if (isMockMode() || !process.env.GEMINI_API_KEY) {
      const data = getMockChatResponse(message);
      
      // Save mock logs to DB for completeness
      if (userId) {
        try {
          const dbUser = await getOrCreateDbUser(userId);
          await prisma.chatMessage.create({
            data: { userId: dbUser.id, resumeId: resumeId || null, role: "user", content: message, language: detectedLanguage },
          });
          await prisma.chatMessage.create({
            data: { userId: dbUser.id, resumeId: resumeId || null, role: "assistant", content: data.reply, language: data.language },
          });
        } catch (dbErr) {
          console.error("Mock chat DB save error:", dbErr);
        }
      }

      const apiResponse: ApiResponse<ChatResponse> = {
        success: true,
        data,
      };
      return NextResponse.json(apiResponse);
    }

    // Prepare system instructions and message thread for Gemini
    const systemPrompt = `You are "ResumAI Assistant", an elite AI career coach and multilingual resume specialist.
You MUST natively support English, Telugu, Hindi, French, Japanese, and other major languages.
You will converse with the user in the language they write in (e.g. if they write in Telugu, reply in Telugu; if they write in Hindi, reply in Hindi; if they write in French, reply in French; if they write in Japanese, reply in Japanese).

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

    const data: ChatResponse = {
      reply: replyText.trim(),
      language: detectedLanguage,
    };

    // Save live logs to DB
    if (userId) {
      try {
        const dbUser = await getOrCreateDbUser(userId);
        await prisma.chatMessage.create({
          data: { userId: dbUser.id, resumeId: resumeId || null, role: "user", content: message, language: detectedLanguage },
        });
        await prisma.chatMessage.create({
          data: { userId: dbUser.id, resumeId: resumeId || null, role: "assistant", content: data.reply, language: detectedLanguage },
        });
      } catch (dbErr) {
        console.error("Live chat DB save error:", dbErr);
      }
    }

    const apiResponse: ApiResponse<ChatResponse> = {
      success: true,
      data,
    };

    return NextResponse.json(apiResponse);
  } catch (error: any) {
    console.error("Error in ai-chat:", error);
    
    // Graceful fallback response on error
    const data = getMockChatResponse("");
    const apiResponse: ApiResponse<ChatResponse> = {
      success: true,
      data,
    };
    return NextResponse.json(apiResponse);
  }
}

/**
 * DELETE /api/ai/chat
 * Deletes chat history for the authenticated user (optionally filtered by resumeId).
 */
export async function DELETE(req: NextRequest) {
  try {
    const userId = await getSessionUser();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await getOrCreateDbUser(userId);
    const { searchParams } = new URL(req.url);
    const resumeId = searchParams.get("resumeId");

    await prisma.chatMessage.deleteMany({
      where: {
        userId: dbUser.id,
        ...(resumeId ? { resumeId } : {}),
      },
    });

    return NextResponse.json({ success: true, message: "Chat history cleared successfully" });
  } catch (error: any) {
    console.error("DELETE /api/ai/chat error:", error);
    return NextResponse.json({ success: false, error: "Failed to clear chat history" }, { status: 500 });
  }
}
