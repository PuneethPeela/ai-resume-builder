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

interface InterviewCard {
  id: string;
  category: "Behavioral" | "Systems" | "Coding";
  question: string;
  idealAnswer: string;
}

// Highly responsive local fallback that personalizes questions to candidate's skills when LLM is unavailable
function getMockQuestionsForResume(resumeData: any): InterviewCard[] {
  const skills = resumeData?.skills || [];
  const projects = resumeData?.projects || [];
  const experiences = resumeData?.experience || [];

  const mainSkill = skills[0] || "JavaScript";
  const secondSkill = skills[1] || "React";
  const projectTitle = projects[0]?.name || "Portfolio Builder";
  const companyName = experiences[0]?.company || "previous company";

  return [
    {
      id: "mock-1",
      category: "Behavioral",
      question: `Describe a time at ${companyName} when you faced a tight deadline or technical bottleneck while working with ${mainSkill}. How did you prioritize?`,
      idealAnswer: `Structure your answer using the STAR (Situation, Task, Action, Result) method:\n\n1. **Situation:** In my previous role at ${companyName}, we had a major client demo in 2 weeks but experienced severe rendering delays with our dashboard.\n2. **Task:** I needed to diagnose and resolve the rendering bottleneck (related to ${mainSkill} data processing) under strict time pressure.\n3. **Action:** I profile-audited the rendering frames, set up memoization, refactored data operations to run off-thread, and established a staging pipeline.\n4. **Result:** Performance jumped by 40%, and the launch happened without errors, resulting in high customer satisfaction.`,
    },
    {
      id: "mock-2",
      category: "Coding",
      question: `Explain how you would write a high-performance debouncer in ${mainSkill} or TypeScript. What edge cases must be handled in production?`,
      idealAnswer: `An ideal debouncer prevents rapid-fire event executions. Here is a modern implementation in ${mainSkill}:\n\n\`\`\`javascript\nexport function debounce(fn, delayMs) {\n  let timeoutId = null;\n  return function (...args) {\n    if (timeoutId) clearTimeout(timeoutId);\n    timeoutId = setTimeout(() => {\n      fn.apply(this, args);\n    }, delayMs);\n  };\n}\n\`\`\`\n\n**Production Edge Cases:**\n- **Cancellation:** Allow canceling the pending call if the component unmounts.\n- **Immediate Option:** Invoke immediately on the leading edge instead of trailing.\n- **Memory Leaks:** Clean up timers correctly in React \`useEffect\` hooks.`,
    },
    {
      id: "mock-3",
      category: "Systems",
      question: `How would you architect a scalable real-time update engine for a project like ${projectTitle} to handle 10,000+ concurrent connections?`,
      idealAnswer: `To scale real-time updates for ${projectTitle}:\n\n1. **Protocol:** Use WebSockets (via Socket.io or native uWebSockets) or Server-Sent Events (SSE) depending on whether bidirectional messaging is needed.\n2. **Pub/Sub Broker:** Implement Redis Pub/Sub to coordinate updates across multiple horizontal server pods.\n3. **Caching:** Keep hot states in a memory cache (Redis cluster) to prevent heavy database queries.\n4. **Load Balancer:** Set up Nginx or AWS ALB with session sticky-routing or standard WebSocket tunneling.\n5. **Database Scaling:** Use read-replicas or horizontal sharding to prevent write bottlenecks.`,
    },
    {
      id: "mock-4",
      category: "Behavioral",
      question: `Tell me about a technical dispute or architecture disagreement you had regarding the design of ${projectTitle}. How did you resolve it?`,
      idealAnswer: `Use the STAR method:\n\n- **Situation:** While designing the core framework for ${projectTitle}, our team disagreed on choosing SQL vs. NoSQL.\n- **Task:** Mediate the team's engineering perspectives and deliver a choice that is future-proof and robust.\n- **Action:** I drafted a detailed Trade-offs Grid analyzing read/write patterns, schema integrity, and maintainability. I set up a time-boxed benchmark with 10M rows to capture true performance metrics.\n- **Result:** Data proved that a PostgreSQL relational schema with JSONB columns met both our scaling and flexible schema needs, aligning the team around a unified data model.`,
    },
    {
      id: "mock-5",
      category: "Systems",
      question: `Since you list ${secondSkill} in your resume, explain the inner mechanics of its reconciliation algorithm or rendering cycle, and how to avoid redundant renders.`,
      idealAnswer: `If using React (${secondSkill}):\n- **Fiber Tree:** React builds a virtual DOM tree (Fiber) and computes diffs against the previous frame.\n- **Redundant Renders:** Prevent these by:\n  1. Wrapping heavy child components with \`React.memo\`.\n  2. Memoizing callback props with \`useCallback\` and calculated values with \`useMemo\`.\n  3. Avoiding global context states for high-frequency updates; use lightweight stores like Zustand instead.\n  4. Utilizing CSS-based container queries and modern animation loops to bypass layout recalculations.`,
    },
    {
      id: "mock-6",
      category: "Coding",
      question: `How do you implement deep equality check in ${mainSkill} to handle nested objects, arrays, and dates?`,
      idealAnswer: `To deeply compare two objects without relying on slow \`JSON.stringify\`:\n\n\`\`\`javascript\nexport function deepEqual(a, b) {\n  if (a === b) return true;\n  if (a == null || b == null) return false;\n  if (typeof a !== 'object' || typeof b !== 'object') return false;\n  \n  const keysA = Object.keys(a);\n  const keysB = Object.keys(b);\n  \n  if (keysA.length !== keysB.length) return false;\n  \n  for (const key of keysA) {\n    if (!keysB.includes(key)) return false;\n    if (!deepEqual(a[key], b[key])) return false;\n  }\n  return true;\n}\n\`\`\`\n\n**Edge Cases Covered:** Correctly checks values, checks matching keys lengths, recursive matching, and ensures precise equality comparisons.`,
    },
  ];
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getSessionUser();
    const identifier = userId ? `ai-prep-${userId}` : "ai-prep-anonymous";

    // Rate Limit check
    const limitResult = await checkRateLimit(identifier);
    if (!limitResult.success) {
      // Return custom mock cards under rate limits so user doesn't hit a wall
      const body = await req.json();
      const mockCards = getMockQuestionsForResume(body.resumeData);
      return NextResponse.json({
        success: true,
        data: mockCards,
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
        data: getMockQuestionsForResume(resumeData),
      });
    }

    const prompt = `You are an elite technical interviewer and career coach.
Analyze the following resume data:
${JSON.stringify(resumeData, null, 2)}

Task:
Generate exactly 6 highly personalized, challenging interview preparation cards tailored to the candidate's exact background (skills, projects, work experience).
- 2 Behavioral questions (exploring their specific projects or experiences using the STAR method format).
- 2 Systems Architecture/Design questions (challenging them to scale a system similar to their projects/experience, or testing their technical stack like database or API scaling).
- 2 Coding/Algorithms questions (focused on the specific programming languages and libraries they know, like React rendering, asynchronous JavaScript, Python data pipelines, etc.).

For each question:
1. Formulate a challenging, realistic interview question.
2. Provide a detailed, elite "Ideal Answer" that a top-tier engineer (L5+) would give. This should contain code snippets or step-by-step methodologies where appropriate.

Your output MUST be a JSON array of objects with these EXACT keys:
[
  {
    "id": "1",
    "category": "Behavioral" | "Systems" | "Coding",
    "question": "Challenging question...",
    "idealAnswer": "Ideal answer description..."
  }
]
Do not include markdown code fence formatting like \`\`\`json. Output only the pure JSON array.`;

    const result = await geminiModel.generateContent(prompt);
    const responseText = result.response.text().trim();
    
    // Parse the JSON returned by Gemini
    let data: InterviewCard[];
    try {
      // Remove any possible leading/trailing code fences
      const cleanJson = responseText
        .replace(/^```json/i, "")
        .replace(/^```/, "")
        .replace(/```$/, "")
        .trim();
      data = JSON.parse(cleanJson);
    } catch (parseErr) {
      console.error("Gemini JSON Parse Error, response was:", responseText, parseErr);
      data = getMockQuestionsForResume(resumeData);
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error("Error in interview-prep API:", error);
    // Graceful fallback to personalized mock cards
    try {
      const body = await req.json();
      return NextResponse.json({
        success: true,
        data: getMockQuestionsForResume(body.resumeData),
      });
    } catch {
      return NextResponse.json({
        success: true,
        data: getMockQuestionsForResume({}),
      });
    }
  }
}
