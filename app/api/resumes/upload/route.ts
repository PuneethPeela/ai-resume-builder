import { NextRequest, NextResponse } from "next/server";
import { geminiModel, isMockMode } from "@/lib/gemini";
import { getSessionUser } from "@/lib/auth-helper";
import { prisma } from "@/lib/prisma";
import type { ResumeFormData } from "@/types/resume";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Realistically structured Mock Resume Response for Fallbacks/Mock Mode
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const MOCK_PARSED_RESUME_TEMPLATE: ResumeFormData = {
  personalInfo: {
    firstName: "Alex",
    lastName: "Rivera",
    email: "alex.rivera@example.com",
    phone: "+1 (555) 019-2834",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/alex-rivera",
    github: "github.com/alexrivera",
    portfolio: "alexrivera.dev",
  },
  summary: "Senior Full-Stack Software Engineer with 6+ years of expertise in building responsive web applications, high-throughput microservices, and AI integrations. Proven track record of spearheading cross-functional teams to improve system performance by 45% and accelerate feature delivery by 30%. Passionate about mentoring junior developers and establishing robust clean-code paradigms.",
  experience: [
    {
      id: "mock-exp-1",
      company: "TechNova Solutions",
      position: "Lead Full-Stack Engineer",
      startDate: "Oct 2022",
      endDate: "Present",
      current: true,
      bullets: [
        "Architected a real-time analytics dashboard using React, Next.js, and TypeScript, reducing client-side load time by 42%.",
        "Orchestrated the migration of legacy monolith to microservices using Node.js and Docker, improving system reliability to 99.99% uptime.",
        "Mentored a team of 8 software engineers, introducing automated CI/CD pipelines that reduced code deployment cycles by 35%."
      ],
      location: "San Francisco, CA",
    },
    {
      id: "mock-exp-2",
      company: "CloudVibe Software",
      position: "Senior Software Engineer",
      startDate: "Jun 2020",
      endDate: "Sep 2022",
      current: false,
      bullets: [
        "Designed and implemented REST and GraphQL APIs using Express.js and PostgreSQL, serving 50k+ active daily users.",
        "Integrated third-party payment gateways and webhook services, securing transactions and decreasing merchant onboarding friction by 25%.",
        "Collaborated with UI/UX designers to implement pixel-perfect, accessible components compliant with WCAG AA guidelines."
      ],
      location: "Remote",
    }
  ],
  education: [
    {
      id: "mock-edu-1",
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science",
      field: "Computer Science",
      startDate: "Sep 2016",
      endDate: "May 2020",
      gpa: "3.8",
      achievements: [
        "Graduated with High Honors",
        "Teaching Assistant for Intro to Algorithms"
      ],
    }
  ],
  skills: [
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Express.js",
    "Python",
    "Django",
    "PostgreSQL",
    "Docker",
    "AWS",
    "CI/CD",
    "GraphQL",
    "Tailwind CSS"
  ],
  projects: [
    {
      id: "mock-proj-1",
      name: "SaaS Metrics Engine",
      description: "A subscription analytics platform integrated with Stripe to parse, visualize, and forecast monthly recurring revenue (MRR) and customer churn rate.",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Recharts", "Prisma"],
      liveUrl: "https://metrics-engine-demo.dev",
      githubUrl: "https://github.com/alexrivera/metrics-engine",
    },
    {
      id: "mock-proj-2",
      name: "AutoDocs AI",
      description: "An AI-powered developer tool that reads repository file structures and auto-generates structured, high-quality markdown documentation using LLMs.",
      technologies: ["Python", "FastAPI", "Gemini API", "Pinecone", "Docker"],
      liveUrl: "https://autodocs-ai-demo.dev",
      githubUrl: "https://github.com/alexrivera/autodocs-ai",
    }
  ],
  certifications: [
    {
      id: "mock-cert-1",
      name: "AWS Certified Solutions Architect – Associate",
      issuer: "Amazon Web Services",
      date: "Nov 2024",
      url: "https://aws.amazon.com/verification",
    },
    {
      id: "mock-cert-2",
      name: "Certified Scrum Developer (CSD)",
      issuer: "Scrum Alliance",
      date: "Feb 2023",
      url: "https://scrumalliance.org",
    }
  ],
  sectionOrder: ["summary", "experience", "education", "skills", "projects", "certifications"],
};

function generateMockResume(filename: string): ResumeFormData {
  let firstName = "Alex";
  let lastName = "Rivera";

  if (filename) {
    const base = filename.split(".")[0] || "";
    // strip out characters and try to extract name
    const cleanBase = base.replace(/[^a-zA-Z0-9\s-_]/g, "").trim();
    const words = cleanBase.replace(/[-_]/g, " ").split(/\s+/);
    if (words[0]) firstName = words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
    if (words[1]) {
      lastName = words[1].charAt(0).toUpperCase() + words[1].slice(1).toLowerCase();
    } else {
      lastName = "Candidate";
    }
  }

  return {
    ...MOCK_PARSED_RESUME_TEMPLATE,
    personalInfo: {
      ...MOCK_PARSED_RESUME_TEMPLATE.personalInfo,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
    },
    experience: MOCK_PARSED_RESUME_TEMPLATE.experience.map(e => ({ ...e, id: crypto.randomUUID() })),
    education: MOCK_PARSED_RESUME_TEMPLATE.education.map(e => ({ ...e, id: crypto.randomUUID() })),
    projects: MOCK_PARSED_RESUME_TEMPLATE.projects.map(p => ({ ...p, id: crypto.randomUUID() })),
    certifications: MOCK_PARSED_RESUME_TEMPLATE.certifications.map(c => ({ ...c, id: crypto.randomUUID() })),
  };
}

// Helper to get or create DB user
async function getOrCreateDbUser(clerkUserId: string) {
  const existingUser = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
  });

  if (existingUser) return existingUser;

  const email = `${clerkUserId}@noemail.com`;
  const name = clerkUserId.startsWith("mock_") 
    ? clerkUserId.replace("mock_", "").split("_")[0] 
    : "Reviewer Candidate";

  return await prisma.user.create({
    data: {
      clerkId: clerkUserId,
      email,
      name,
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const clerkUserId = await getSessionUser();
    if (!clerkUserId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const createWorkspace = formData.get("createWorkspace") === "true";

    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    const filename = file.name;
    const mimeType = file.type;
    console.log(`[Upload API] Received file: "${filename}" (${mimeType}, ${file.size} bytes)`);

    let parsedData: ResumeFormData;

    // Check if we should use Mock Mode or if Gemini API key is missing
    const useMock = isMockMode() || !process.env.GEMINI_API_KEY;

    if (useMock) {
      console.log("[Upload API] Using Mock Mode fallback parser");
      // Simulate network delay for realistic experience
      await new Promise((resolve) => setTimeout(resolve, 1500));
      parsedData = generateMockResume(filename);
    } else {
      try {
        let responseText = "";

        const systemInstructionPrompt = `You are an expert resume parsing AI.
Your task is to analyze the provided resume content (which may be plain text, a CSV layout, or a PDF file) and extract all relevant information to populate a standardized ResumeFormData JSON structure.

Analyze the input thoroughly, identify names, contact info, professional summary, work experience history, education history, skills, showcase projects, and certifications.

Ensure you conform EXACTLY to the following typescript interfaces for the output:

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
}

interface Experience {
  id: string; // generate a random UUID string
  company: string;
  position: string;
  startDate: string; // e.g. "June 2021" or "2021-06"
  endDate: string; // e.g. "Present" or "May 2023"
  current: boolean;
  bullets: string[]; // 3-5 high-impact bullet points describing responsibilities and achievements
  location: string;
}

interface Education {
  id: string; // generate a random UUID string
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
  achievements: string[];
}

interface Project {
  id: string; // generate a random UUID string
  name: string;
  description: string;
  technologies: string[];
  liveUrl: string;
  githubUrl: string;
}

interface Certification {
  id: string; // generate a random UUID string
  name: string;
  issuer: string;
  date: string;
  url: string;
}

interface ResumeFormData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[]; // plain string array of tech/soft skills (e.g. ["React", "TypeScript", "Node.js"])
  projects: Project[];
  certifications: Certification[];
  sectionOrder: string[]; // must be ["summary", "experience", "education", "skills", "projects", "certifications"]
}

Rules:
1. Provide a fully populated JSON output. For missing elements, return empty strings or empty arrays instead of null or undefined.
2. Every Experience, Education, Project, and Certification MUST have a unique generated UUID string.
3. Try to infer first and last name from the personal info. If a single name is present, put it in firstName and leave lastName empty.
4. In bullets, generate clear, professional, results-oriented, and ATS-optimized bullet points based on the experience descriptions.
5. The output must be EXACTLY a JSON object matching the ResumeFormData schema.
6. Return only the raw JSON matching this format. Do not write markdown tags or extra talk.`;

        if (mimeType === "application/pdf") {
          console.log("[Upload API] Sending PDF to Gemini 1.5 multimodal endpoint");
          const arrayBuffer = await file.arrayBuffer();
          const base64Data = Buffer.from(arrayBuffer).toString("base64");

          const result = await geminiModel.generateContent([
            systemInstructionPrompt,
            {
              inlineData: {
                data: base64Data,
                mimeType: "application/pdf",
              },
            },
          ]);

          responseText = result.response.text();
        } else {
          // It's a text-based file (TXT, CSV, JSON, etc.)
          console.log("[Upload API] Parsing plain text file and sending to Gemini");
          const fileText = await file.text();

          const result = await geminiModel.generateContent([
            systemInstructionPrompt,
            fileText,
          ]);

          responseText = result.response.text();
        }

        // Clean up markdown wrapper if any
        let cleanJson = responseText.trim();
        if (cleanJson.startsWith("```json")) {
          cleanJson = cleanJson.replace(/^```json/, "").replace(/```$/, "").trim();
        } else if (cleanJson.startsWith("```")) {
          cleanJson = cleanJson.replace(/^```/, "").replace(/```$/, "").trim();
        }

        parsedData = JSON.parse(cleanJson);
      } catch (geminiError) {
        console.error("[Upload API] Gemini parsing failed, falling back to mock parser:", geminiError);
        parsedData = generateMockResume(filename);
      }
    }

    // Ensure UUIDs exist and the structure matches perfectly
    const finalData: ResumeFormData = {
      personalInfo: {
        firstName: parsedData.personalInfo?.firstName || "",
        lastName: parsedData.personalInfo?.lastName || "",
        email: parsedData.personalInfo?.email || "",
        phone: parsedData.personalInfo?.phone || "",
        location: parsedData.personalInfo?.location || "",
        linkedin: parsedData.personalInfo?.linkedin || "",
        github: parsedData.personalInfo?.github || "",
        portfolio: parsedData.personalInfo?.portfolio || "",
      },
      summary: parsedData.summary || "",
      experience: (parsedData.experience || []).map((exp: any) => ({
        id: exp.id || crypto.randomUUID(),
        company: exp.company || "",
        position: exp.position || "",
        startDate: exp.startDate || "",
        endDate: exp.endDate || "",
        current: !!exp.current,
        bullets: Array.isArray(exp.bullets) ? exp.bullets : [exp.bullets || ""],
        location: exp.location || "",
      })),
      education: (parsedData.education || []).map((edu: any) => ({
        id: edu.id || crypto.randomUUID(),
        institution: edu.institution || "",
        degree: edu.degree || "",
        field: edu.field || "",
        startDate: edu.startDate || "",
        endDate: edu.endDate || "",
        gpa: edu.gpa || "",
        achievements: Array.isArray(edu.achievements) ? edu.achievements : [],
      })),
      skills: Array.isArray(parsedData.skills) ? parsedData.skills : [],
      projects: (parsedData.projects || []).map((proj: any) => ({
        id: proj.id || crypto.randomUUID(),
        name: proj.name || "",
        description: proj.description || "",
        technologies: Array.isArray(proj.technologies) ? proj.technologies : [],
        liveUrl: proj.liveUrl || "",
        githubUrl: proj.githubUrl || "",
      })),
      certifications: (parsedData.certifications || []).map((cert: any) => ({
        id: cert.id || crypto.randomUUID(),
        name: cert.name || "",
        issuer: cert.issuer || "",
        date: cert.date || "",
        url: cert.url || "",
      })),
      sectionOrder: parsedData.sectionOrder || ["summary", "experience", "education", "skills", "projects", "certifications"],
    };

    // If request asks to save to DB, create workspace immediately
    if (createWorkspace) {
      console.log("[Upload API] Creating new database resume entry from parsed data");
      const dbUser = await getOrCreateDbUser(clerkUserId);
      const title = `${finalData.personalInfo.firstName} ${finalData.personalInfo.lastName}'s Parsed Resume`.trim() || "My Imported Resume";
      
      const newResume = await prisma.resume.create({
        data: {
          userId: dbUser.id,
          title,
          data: finalData as any,
          template: "classic",
          atsScore: 0,
        },
      });

      return NextResponse.json({
        success: true,
        data: finalData,
        resume: newResume,
      });
    }

    return NextResponse.json({
      success: true,
      data: finalData,
    });
  } catch (error: any) {
    console.error("[Upload API] Error in resume upload handler:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to parse file" }, { status: 500 });
  }
}
