import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth-helper";
import { z } from "zod";
import { geminiChatModel, isMockMode } from "@/lib/gemini";
import { checkRateLimit } from "@/lib/rate-limit";

const requestSchema = z.object({
  resumeData: z.object({
    personalInfo: z.object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      email: z.string().optional(),
      phone: z.string().optional(),
      location: z.string().optional(),
      linkedin: z.string().optional(),
      github: z.string().optional(),
      portfolio: z.string().optional(),
    }).optional(),
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
    const userId = await getSessionUser();
    const identifier = userId ? `ai-cl-${userId}` : "ai-cl-anonymous";

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
        { success: false, error: "Invalid request payload. Ensure jobDescription and resumeData are provided." },
        { status: 400 }
      );
    }

    const { resumeData, jobDescription } = parsed.data;
    const personalInfo = resumeData.personalInfo || {};
    const fullName = `${personalInfo.firstName || ""} ${personalInfo.lastName || ""}`.trim() || "Applicant";
    const email = personalInfo.email || "applicant@example.com";
    const phone = personalInfo.phone || "";
    const location = personalInfo.location || "";

    // Generate Tailored Mock Cover Letter
    const getTailoredMockResponse = () => {
      // Try to extract a potential company or title from the JD
      let company = "Your Company";
      let title = "Software Engineer";
      
      const lines = jobDescription.split("\n");
      for (const line of lines) {
        if (line.toLowerCase().includes("company:") || line.toLowerCase().includes("at ")) {
          const match = line.match(/(?:company:|at\s+)([A-Z][a-zA-Z0-9\s.]+)/i);
          if (match && match[1]) {
            company = match[1].trim();
            break;
          }
        }
      }

      for (const line of lines) {
        if (line.toLowerCase().includes("title:") || line.toLowerCase().includes("role:")) {
          const match = line.match(/(?:title:|role:)\s*([A-Za-z\s-]{4,})/i);
          if (match && match[1]) {
            title = match[1].trim();
            break;
          }
        }
      }

      return `
${fullName}
${location ? `${location} | ` : ""}${email}${phone ? ` | ${phone}` : ""}

${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}

Hiring Manager
${company}

Subject: Application for ${title}

Dear Hiring Manager,

I am writing to express my keen interest in the ${title} position. Based on your job description and my strong background as a Software Engineer, I am highly confident in my ability to make an immediate, positive impact on your development team.

During my professional career, I have honed key technical capabilities in ${resumeData.skills?.slice(0, 5).join(", ") || "software engineering, modern JavaScript frameworks, and database architecture"}. Notably, in my recent role, I developed scalable platforms and refined user interfaces, which improved responsiveness by 60% and successfully supported high volumes of active users in an agile production environment.

Your job description's focus on engineering excellence and modern product scale matches my professional aspirations perfectly. I pride myself on writing clean, maintainable code, implementing responsive layouts, and designing reliable service integrations that directly solve business problems.

Thank you for your time and consideration. I would welcome the opportunity to discuss how my qualifications, collaborative spirit, and passion for elegant code can contribute to ${company}'s ongoing success.

Sincerely,

${fullName}
      `.trim();
    };

    // If Mock Mode is active or Gemini Key is missing, return tailored mock
    if (isMockMode() || !process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        success: true,
        data: {
          coverLetter: getTailoredMockResponse(),
        },
      });
    }

    // Build the expert prompt for Gemini
    const prompt = `
You are an expert executive resume writer and career consultant.
Write a highly customized, compelling cover letter for a candidate based on their Resume Data and a target Job Description.

Candidate Resume Data:
${JSON.stringify(resumeData, null, 2)}

Target Job Description:
${jobDescription}

Strict Guidelines for the Cover Letter:
1. Formatting: Use standard, clean professional cover letter formatting:
   - Header with Candidate Name, Location, Email, and Phone.
   - Date.
   - Recipient (Hiring Manager / Team, target Company name).
   - Subject Line.
   - Professional salutation.
   - 3 to 4 high-impact body paragraphs.
   - Sign-off with the Candidate's Name.
2. Tone: Bold, confident, and professional. Write in active voice. Avoid generic clichés, passive descriptions, or fluffy corporate jargon. Focus on actual strengths and quantifiable outcomes.
3. Personalization: Draw directly from the experience, skills, and projects in the resume, aligning them to the requirements mentioned in the job description. Emphasize why the candidate is uniquely suited for the company's product and team.
4. Word Count: Ensure it fits a standard single-page business letter (typically 250 to 400 words).

Output ONLY the raw markdown of the completed cover letter. Do not include extra conversational text or formatting instructions.
    `.trim();

    const result = await geminiChatModel.generateContent(prompt);
    const coverLetterText = result.response.text();

    return NextResponse.json({
      success: true,
      data: {
        coverLetter: coverLetterText,
      },
    });
  } catch (error: any) {
    console.error("Error generating cover letter:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate cover letter. Please try again." },
      { status: 500 }
    );
  }
}
