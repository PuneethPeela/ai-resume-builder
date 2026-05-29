/**
 * Mock AI Responses — used when NEXT_PUBLIC_MOCK_AI=true
 * Ensures demo works flawlessly even if Gemini rate-limits.
 * All responses are pre-stored, realistic-looking data.
 */

import type {
  GenerateSummaryResponse,
  ImproveBulletResponse,
  ATSScoreResponse,
  TailorResumeResponse,
  ChatResponse,
} from "@/types/api";

export const MOCK_SUMMARY: GenerateSummaryResponse = {
  summary:
    "Results-driven Software Engineer with 2+ years of experience in full-stack web development using React, Node.js, and Python. Proven track record of delivering high-performance applications that improved user engagement by 40%. Passionate about AI integration and building scalable solutions that solve real-world problems.",
  keywords: [
    "React",
    "Node.js",
    "Python",
    "Full-Stack",
    "AI",
    "Scalable",
    "Web Development",
  ],
  atsEstimate: 78,
  tone: "entry",
};

export const MOCK_IMPROVE_BULLET: ImproveBulletResponse = {
  improved:
    "Spearheaded the development of a React-based dashboard that reduced data retrieval time by 60%, serving 10,000+ daily active users across 3 product teams.",
  actionVerb: "Spearheaded",
  metricAdded: true,
};

export const MOCK_ATS_SCORE: ATSScoreResponse = {
  score: 72,
  missingKeywords: [
    "CI/CD",
    "Docker",
    "Agile",
    "Unit Testing",
    "REST API",
  ],
  presentKeywords: [
    "React",
    "TypeScript",
    "Node.js",
    "PostgreSQL",
    "Git",
    "JavaScript",
    "Python",
  ],
  suggestions: [
    "Add CI/CD experience — mention any GitHub Actions or Jenkins usage",
    "Include Docker/containerization skills if applicable",
    "Mention Agile/Scrum methodology experience",
    "Add specific testing frameworks (Jest, Pytest, Cypress)",
    "Quantify more achievements with specific metrics and percentages",
  ],
  verdict:
    "Good foundation but missing key DevOps and methodology keywords. Adding CI/CD, Docker, and Agile references could boost your score to 85+.",
};

export const MOCK_TAILOR: TailorResumeResponse = {
  tailoredSummary:
    "Innovative Full-Stack Developer with hands-on experience in React, Next.js, and cloud-native architectures. Skilled in building AI-integrated web applications and optimizing user experiences. Seeking to leverage strong problem-solving abilities and modern tech stack expertise in a dynamic engineering team.",
  suggestedSkills: ["Next.js", "AWS", "Docker", "GraphQL", "Tailwind CSS"],
  changes: [
    "Updated summary to emphasize cloud-native and AI integration",
    "Suggested adding Next.js, AWS, Docker based on job description",
    "Reframed experience bullets to match required competencies",
  ],
};

export const MOCK_CHAT_RESPONSES: Record<string, ChatResponse> = {
  default: {
    reply:
      "I'd be happy to help you improve your resume! Based on what I can see, here are my top suggestions:\n\n1. **Add quantifiable metrics** to your experience bullets — numbers catch recruiters' eyes\n2. **Tailor your summary** to match the specific job you're applying for\n3. **Include relevant projects** that demonstrate the skills mentioned in the job posting\n\nWould you like me to help with any of these specifically?",
    language: "en",
  },
  telugu: {
    reply:
      "మీ రెజ్యూమే బాగుంది! కొన్ని మెరుగుదలలు సూచిస్తాను:\n\n1. **మీ అనుభవంలో సంఖ్యలు చేర్చండి** — ఉదాహరణకు \"40% వేగవంతం చేశారు\"\n2. **నైపుణ్యాల విభాగంలో** మరిన్ని టెక్నాలజీలు చేర్చండి\n3. **ప్రాజెక్ట్‌ల వివరణలు** మరింత నిర్దిష్టంగా రాయండి\n\nఏ భాగంలో సహాయం కావాలి?",
    language: "te",
  },
  hindi: {
    reply:
      "आपका रिज्यूमे अच्छा है! कुछ सुझाव:\n\n1. **अपने अनुभव में संख्याएं जोड़ें** — जैसे \"40% सुधार किया\"\n2. **कौशल अनुभाग में** अधिक तकनीकें जोड़ें\n3. **प्रोजेक्ट विवरण** अधिक विशिष्ट बनाएं\n\nकिस भाग में मदद चाहिए?",
    language: "hi",
  },
};

/**
 * Get a mock chat response based on detected language.
 */
export function getMockChatResponse(message: string): ChatResponse {
  // Simple language detection by script
  if (/[\u0C00-\u0C7F]/.test(message)) return MOCK_CHAT_RESPONSES.telugu;
  if (/[\u0900-\u097F]/.test(message)) return MOCK_CHAT_RESPONSES.hindi;
  return MOCK_CHAT_RESPONSES.default;
}
