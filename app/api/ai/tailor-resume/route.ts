import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { geminiModel, isMockMode } from "@/lib/gemini";
import { MOCK_TAILOR } from "@/lib/mock-responses";
import { checkRateLimit } from "@/lib/rate-limit";
import type { TailorResumeResponse, ApiResponse } from "@/types/api";

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
  jobDescription: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    const identifier = userId ? `ai-tailor-${userId}` : "ai-tailor-anonymous";

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

    if (isMockMode() || !process.env.GEMINI_API_KEY) {
      const apiResponse: ApiResponse<TailorResumeResponse> = {
        success: true,
        data: MOCK_TAILOR,
      };
      return NextResponse.json(apiResponse);
    }

    const { resumeData, jobDescription } = parsed.data;

    const prompt = `You are a professional resume strategist and career coach.
Tailor the candidate's resume summary and skills list to perfectly align with the target job description.

Candidate's Current Resume Data:
${JSON.stringify(resumeData, null, 2)}

Target Job Description:
"${jobDescription}"

Tasks:
1. Suggest a tailored version of the candidate's professional summary that highlights experience and skills matching the job description's critical keywords.
2. Recommend a list of 5-8 highly critical skills/technologies that the job description requests but the candidate might need to highlight or add.
3. Outline a list of specific changes or positioning advice (e.g. "Rephrase your first experience bullet to highlight Next.js").

Your output MUST be a JSON object with these EXACT keys:
{
  "tailoredSummary": "A stunning, tailored 3-sentence professional summary text.",
  "suggestedSkills": ["Next.js", "Docker", ...],
  "changes": [
    "Emphasized React Performance optimizations in the summary.",
    "Suggested adding Docker and CI/CD to align with the DevOps focus.",
    ...
  ]
}

Do not include markdown tags. Output only valid JSON.`;

    const result = await geminiModel.generateContent(prompt);
    const responseText = result.response.text();
    
    const data: TailorResumeResponse = JSON.parse(responseText);

    const apiResponse: ApiResponse<TailorResumeResponse> = {
      success: true,
      data,
    };

    return NextResponse.json(apiResponse);
  } catch (error: any) {
    console.error("Error in tailor-resume:", error);
    // Graceful fallback to Mock tailoring if API fails
    const apiResponse: ApiResponse<TailorResumeResponse> = {
      success: true,
      data: MOCK_TAILOR,
    };
    return NextResponse.json(apiResponse);
  }
}
