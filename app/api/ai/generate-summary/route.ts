import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { geminiModel, isMockMode } from "@/lib/gemini";
import { MOCK_SUMMARY } from "@/lib/mock-responses";
import { checkRateLimit } from "@/lib/rate-limit";
import type { GenerateSummaryResponse, ApiResponse } from "@/types/api";

const requestSchema = z.object({
  resumeData: z.object({
    personalInfo: z.any().optional(),
    summary: z.string().optional(),
    experience: z.array(z.any()).optional(),
    education: z.array(z.any()).optional(),
    skills: z.array(z.string()).optional(),
    projects: z.array(z.any()).optional(),
    certifications: z.array(z.any()).optional(),
  }),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    const identifier = userId ? `ai-summary-${userId}` : "ai-summary-anonymous";

    // Rate Limit check
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

    // Mock Mode
    if (isMockMode() || !process.env.GEMINI_API_KEY) {
      const apiResponse: ApiResponse<GenerateSummaryResponse> = {
        success: true,
        data: MOCK_SUMMARY,
      };
      return NextResponse.json(apiResponse);
    }

    const { resumeData } = parsed.data;

    const prompt = `You are an expert resume writer and ATS (Applicant Tracking System) specialist.
Analyze the following resume data:
${JSON.stringify(resumeData, null, 2)}

Task:
Generate a professional, results-driven professional summary that is perfectly optimized for ATS and recruiters.
1. The summary must be exactly 3 sentences.
2. It should highlight key technical skills, experience, and quantifiable achievements.
3. Identify 5-7 key industry keywords that are highly relevant to this profile.
4. Estimate an ATS score (0-100) based on this data.
5. Determine the profile's experience level tone: "entry" (0-2 yrs), "mid" (2-5 yrs), or "senior" (5+ yrs).

Your output MUST be a JSON object with these EXACT keys:
{
  "summary": "The 3-sentence professional summary text.",
  "keywords": ["keyword1", "keyword2", ...],
  "atsEstimate": 75,
  "tone": "entry" | "mid" | "senior"
}

Do not include markdown tags or surrounding text. Output only valid JSON.`;

    const result = await geminiModel.generateContent(prompt);
    const responseText = result.response.text();
    
    // Parse the JSON returned by Gemini
    const data: GenerateSummaryResponse = JSON.parse(responseText);

    const apiResponse: ApiResponse<GenerateSummaryResponse> = {
      success: true,
      data,
    };

    return NextResponse.json(apiResponse);
  } catch (error: any) {
    console.error("Error in generate-summary:", error);
    // Graceful fallback to Mock summary if API fails
    const apiResponse: ApiResponse<GenerateSummaryResponse> = {
      success: true,
      data: MOCK_SUMMARY,
    };
    return NextResponse.json(apiResponse);
  }
}
