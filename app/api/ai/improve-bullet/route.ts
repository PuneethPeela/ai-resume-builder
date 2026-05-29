import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth-helper";
import { z } from "zod";
import { geminiModel, isMockMode } from "@/lib/gemini";
import { MOCK_IMPROVE_BULLET } from "@/lib/mock-responses";
import { checkRateLimit } from "@/lib/rate-limit";
import type { ImproveBulletResponse, ApiResponse } from "@/types/api";

const requestSchema = z.object({
  bullet: z.string(),
  jobTitle: z.string(),
  context: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const userId = await getSessionUser();
    const identifier = userId ? `ai-bullet-${userId}` : "ai-bullet-anonymous";

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
      const apiResponse: ApiResponse<ImproveBulletResponse> = {
        success: true,
        data: MOCK_IMPROVE_BULLET,
      };
      return NextResponse.json(apiResponse);
    }

    const { bullet, jobTitle, context = "" } = parsed.data;

    const prompt = `You are a world-class professional resume writer.
Enhance the following resume bullet point using Google's Google's XYZ formula:
"Accomplished [X] as measured by [Y], by doing [Z]"

Input Details:
- Bullet Point: "${bullet}"
- Candidate Job Title: "${jobTitle}"
- Company/Context: "${context}"

Instructions:
1. Make it active and highly impactful. Start with a strong, diverse action verb.
2. Infuse realistic, industry-appropriate metrics (numbers, dollar values, percentages) if the input doesn't already contain one.
3. Keep it brief, professional, and within 1-2 lines.
4. Extract the primary action verb used.
5. Set 'metricAdded' to true if a percentage or numerical metric was introduced.

Your output MUST be a JSON object with these EXACT keys:
{
  "improved": "The newly rewritten and optimized resume bullet point text.",
  "actionVerb": "Spearheaded" (or whichever active verb you used),
  "metricAdded": true | false
}

Do not include markdown tags. Output only valid JSON.`;

    const result = await geminiModel.generateContent(prompt);
    const responseText = result.response.text();
    
    const data: ImproveBulletResponse = JSON.parse(responseText);

    const apiResponse: ApiResponse<ImproveBulletResponse> = {
      success: true,
      data,
    };

    return NextResponse.json(apiResponse);
  } catch (error: any) {
    console.error("Error in improve-bullet:", error);
    // Graceful fallback to Mock bullet if API fails
    const apiResponse: ApiResponse<ImproveBulletResponse> = {
      success: true,
      data: MOCK_IMPROVE_BULLET,
    };
    return NextResponse.json(apiResponse);
  }
}
