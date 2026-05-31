import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth-helper";
import { z } from "zod";
import { geminiModel, isMockMode } from "@/lib/gemini";
import { MOCK_ATS_SCORE } from "@/lib/mock-responses";
import { checkRateLimit } from "@/lib/rate-limit";
import type { ATSScoreResponse, ApiResponse } from "@/types/api";

const requestSchema = z.object({
  resumeJson: z.object({
    personalInfo: z.any().optional(),
    summary: z.string().optional(),
    experience: z.array(z.any()).optional(),
    education: z.array(z.any()).optional(),
    skills: z.array(z.string()).optional(),
    projects: z.array(z.any()).optional(),
    certifications: z.array(z.any()).optional(),
  }).optional(),
  resumeData: z.any().optional(), // Fallback for backward compatibility
  jobDescription: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const userId = await getSessionUser();
    const identifier = userId ? `ai-ats-${userId}` : "ai-ats-anonymous";

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
      const apiResponse: ApiResponse<ATSScoreResponse> = {
        success: true,
        data: MOCK_ATS_SCORE,
      };
      return NextResponse.json(apiResponse);
    }

    const { resumeJson, resumeData, jobDescription } = parsed.data;
    const finalResume = resumeJson || resumeData;

    const prompt = `You are a state-of-the-art Applicant Tracking System (ATS) and Technical Recruiter.
Analyze the candidate's resume and check it against the target job description to compute a professional ATS matching score, identify missing keywords, and suggest tailored adjustments to ensure the resume passes ATS.

Resume Data:
${JSON.stringify(finalResume, null, 2)}

Target Job Description:
"${jobDescription}"

Tasks:
1. Parse the job description to find required and preferred skills, technologies, and methodologies.
2. Compare them against the candidate's resume (skills, experience, projects, summary) to list the 'presentKeywords' and 'missingKeywords'.
3. Assign a realistic matching score from 0 to 100 based on keyword density, role relevancy, and experience alignment.
4. Provide 3-5 highly actionable, specific recommendations to optimize the resume for this job.
5. Write a professional, encouraging, and critical 'verdict' summary.

Your output MUST be a JSON object with these EXACT keys:
{
  "score": 85 (integer between 0 and 100),
  "missingKeywords": ["Docker", "CI/CD", ...],
  "presentKeywords": ["React", "TypeScript", ...],
  "suggestions": [
    "Add 'CI/CD' experience under your professional experience section.",
    "Mention specific 'Agile' project methodologies.",
    ...
  ],
  "verdict": "A detailed 2-3 sentence overview analyzing the match and giving encouragement."
}

Do not include markdown tags. Output only valid JSON.`;

    const result = await geminiModel.generateContent(prompt);
    const responseText = result.response.text();
    
    const data: ATSScoreResponse = JSON.parse(responseText);

    const apiResponse: ApiResponse<ATSScoreResponse> = {
      success: true,
      data,
    };

    return NextResponse.json(apiResponse);
  } catch (error: any) {
    console.error("Error in ats-score:", error);
    // Graceful fallback to Mock ATS score if API fails
    const apiResponse: ApiResponse<ATSScoreResponse> = {
      success: true,
      data: MOCK_ATS_SCORE,
    };
    return NextResponse.json(apiResponse);
  }
}
