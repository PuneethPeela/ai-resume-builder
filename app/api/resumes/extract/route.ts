import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth-helper";
import { z } from "zod";
import { geminiModel, isMockMode } from "@/lib/gemini";
import { checkRateLimit } from "@/lib/rate-limit";
import type { ResumeFormData } from "@/types/resume";
import { EMPTY_RESUME } from "@/types/resume";

const requestSchema = z.object({
  rawText: z.string().min(10, "Text is too short"),
});

export async function POST(req: NextRequest) {
  try {
    const userId = await getSessionUser();
    const identifier = userId ? `ai-extract-${userId}` : "ai-extract-anonymous";

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

    const { rawText } = parsed.data;

    if (isMockMode() || !process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        success: true,
        data: EMPTY_RESUME,
      });
    }

    const prompt = `You are an expert data extractor and resume parser.
I will provide you with raw text extracted from a PDF or CSV resume.
Your task is to parse this text and map it to a specific JSON structure representing a resume.

Raw Text:
${rawText}

Map the data into this EXACT JSON structure. Follow it strictly. Return ONLY the JSON object, with no markdown formatting or extra text. Use the language of the original text. For UUIDs, generate random alphanumeric strings (like "123e4567-e89b-12d3-a456-426614174000"). If a field is missing in the raw text, leave it as an empty string or empty array as appropriate. Do not guess information that is not in the text.
The JSON structure:
{
  "personalInfo": {
    "firstName": "",
    "lastName": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "github": "",
    "portfolio": ""
  },
  "summary": "",
  "experience": [
    {
      "id": "uuid",
      "company": "",
      "position": "",
      "startDate": "",
      "endDate": "",
      "current": false,
      "bullets": [""],
      "location": ""
    }
  ],
  "education": [
    {
      "id": "uuid",
      "institution": "",
      "degree": "",
      "field": "",
      "startDate": "",
      "endDate": "",
      "gpa": "",
      "achievements": [""]
    }
  ],
  "skills": [""],
  "projects": [
    {
      "id": "uuid",
      "name": "",
      "description": "",
      "technologies": [""],
      "liveUrl": "",
      "githubUrl": ""
    }
  ],
  "certifications": [
    {
      "id": "uuid",
      "name": "",
      "issuer": "",
      "date": "",
      "url": ""
    }
  ]
}`;

    const result = await geminiModel.generateContent(prompt);
    const responseText = result.response.text();
    
    const cleanedText = responseText.replace(/\`\`\`json\n?/g, '').replace(/\`\`\`\n?/g, '').trim();
    const data: ResumeFormData = JSON.parse(cleanedText);

    data.sectionOrder = ["summary", "experience", "education", "skills", "projects", "certifications"];

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error("Error in resume-extract:", error);
    return NextResponse.json(
      { success: false, error: "Failed to extract resume data" },
      { status: 500 }
    );
  }
}
