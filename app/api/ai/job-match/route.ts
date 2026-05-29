import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth-helper";
import { z } from "zod";
import { geminiModel, isMockMode } from "@/lib/gemini";
import { checkRateLimit } from "@/lib/rate-limit";
import type { ApiResponse } from "@/types/api";

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

interface CustomRole {
  title: string;
  company: string;
  matchScore: number;
  criticalSkills: string[];
  missingSkills: string[];
  applyUrl: string;
}

interface JobMatchResponse {
  dynamicKeywords: string[];
  customRoles: CustomRole[];
  insights: string;
}

function getMockJobMatch(resumeData: any): JobMatchResponse {
  const skills = resumeData?.skills || [];
  
  // Custom suggestion based on what skills they have
  const hasReact = skills.some((s: string) => /react/i.test(s));
  const hasNode = skills.some((s: string) => /node|backend|express/i.test(s));
  const hasPython = skills.some((s: string) => /python/i.test(s));

  let dynamicKeywords = ["GraphQL", "Docker", "CI/CD"];
  let insights = "Your profile shows solid foundation. Consider incorporating containerization (Docker) and CI/CD pipeline skills to expand your search into full-stack and cloud platforms.";
  let customRoles: CustomRole[] = [];

  if (hasReact) {
    dynamicKeywords = ["Next.js", "Tailwind CSS", "React Native", "TypeScript"];
    insights = "Your strong React background makes you an outstanding fit for product-focused frontend engineering. Adding Next.js and Tailwind will position you perfectly for companies like Vercel and Stripe.";
    customRoles.push({
      title: "Senior Product Engineer",
      company: "Vercel",
      matchScore: 92,
      criticalSkills: ["React", "TypeScript", "Next.js"],
      missingSkills: ["Next.js"],
      applyUrl: "https://vercel.com/careers",
    });
  }

  if (hasNode || hasPython) {
    dynamicKeywords = ["PostgreSQL", "Redis", "gRPC", "Docker"];
    insights = "With backend engineering capability in your profile, incorporating distributed caching (Redis) and containerization will unlock premium mid-to-senior backend roles at high-growth startups.";
    customRoles.push({
      title: "Backend Core Systems Engineer",
      company: "Supabase",
      matchScore: 89,
      criticalSkills: ["Node.js", "PostgreSQL", "Redis"],
      missingSkills: ["Redis"],
      applyUrl: "https://supabase.com/careers",
    });
  }

  // Base fallback if no matches
  if (customRoles.length === 0) {
    customRoles.push({
      title: "Software Engineer, Full Stack",
      company: "Linear",
      matchScore: 85,
      criticalSkills: ["TypeScript", "React", "Node.js"],
      missingSkills: ["TypeScript"],
      applyUrl: "https://linear.app/careers",
    });
  }

  return {
    dynamicKeywords,
    customRoles,
    insights,
  };
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getSessionUser();
    const identifier = userId ? `ai-job-match-${userId}` : "ai-job-match-anonymous";

    // Rate Limit check
    const limitResult = await checkRateLimit(identifier);
    if (!limitResult.success) {
      // Return custom mock under rate limits so user doesn't hit a wall
      const body = await req.json();
      return NextResponse.json({
        success: true,
        data: getMockJobMatch(body.resumeData),
        note: "Rate limited. Showing personalized static matching.",
      });
    }

    const body = await req.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid request payload" },
        { status: 400 }
      );
    }

    const { resumeData } = parsed.data;

    // Check Mock Mode or missing Key
    if (isMockMode() || !process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        success: true,
        data: getMockJobMatch(resumeData),
      });
    }

    const prompt = `You are an elite career development assistant and AI recommendations engineer.
Analyze the following resume data:
${JSON.stringify(resumeData, null, 2)}

Task:
1. Suggest exactly 3-5 highly relevant, cutting-edge technical keywords or frameworks the user should learn to fill gaps in their resume based on their current tech stack.
2. Recommend 1-2 specific roles at leading modern tech startups or companies (e.g. Vercel, Stripe, Supabase, Linear, OpenAI, Scale AI, Figma) that would be an exciting, high-quality match for their profile.
   - For each role, provide: Job Title, Company, a calculated Match Score (0-100), Critical Skills Matched from their resume, Missing Critical Skills they should pick up, and a Careers/Apply URL.
3. Write a 2-3 sentence personalized career insight summarizing their strengths and their highest-impact next step.

Your output MUST be a JSON object with these EXACT keys:
{
  "dynamicKeywords": ["keyword1", "keyword2", "keyword3"],
  "customRoles": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "matchScore": 88,
      "criticalSkills": ["Skill 1", "Skill 2"],
      "missingSkills": ["Skill 3"],
      "applyUrl": "https://company.com/careers"
    }
  ],
  "insights": "Detailed 2-3 sentence career insights..."
}

Do not include markdown code fence formatting like \`\`\`json. Output only the pure JSON.`;

    const result = await geminiModel.generateContent(prompt);
    const responseText = result.response.text().trim();
    
    // Parse the JSON returned by Gemini
    let data: JobMatchResponse;
    try {
      const cleanJson = responseText
        .replace(/^```json/i, "")
        .replace(/^```/, "")
        .replace(/```$/, "")
        .trim();
      data = JSON.parse(cleanJson);
    } catch (parseErr) {
      console.error("Gemini Job Match JSON Parse Error, response was:", responseText, parseErr);
      data = getMockJobMatch(resumeData);
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error("Error in job-match API:", error);
    // Graceful fallback
    try {
      const body = await req.json();
      return NextResponse.json({
        success: true,
        data: getMockJobMatch(body.resumeData),
      });
    } catch {
      return NextResponse.json({
        success: true,
        data: getMockJobMatch({}),
      });
    }
  }
}
