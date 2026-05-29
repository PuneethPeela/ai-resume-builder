// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// API Request/Response Types
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import type { ResumeFormData } from "./resume";

// ── Generate Summary ──
export interface GenerateSummaryRequest {
  resumeData: ResumeFormData;
}

export interface GenerateSummaryResponse {
  summary: string;
  keywords: string[];
  atsEstimate: number;
  tone: "entry" | "mid" | "senior";
}

// ── Improve Bullet ──
export interface ImproveBulletRequest {
  bullet: string;
  jobTitle: string;
  context?: string;
}

export interface ImproveBulletResponse {
  improved: string;
  actionVerb: string;
  metricAdded: boolean;
}

// ── ATS Score ──
export interface ATSScoreRequest {
  resumeData: ResumeFormData;
  jobDescription: string;
}

export interface ATSScoreResponse {
  score: number;
  missingKeywords: string[];
  presentKeywords: string[];
  suggestions: string[];
  verdict: string;
}

// ── Tailor Resume ──
export interface TailorResumeRequest {
  resumeData: ResumeFormData;
  jobDescription: string;
}

export interface TailorResumeResponse {
  tailoredSummary: string;
  suggestedSkills: string[];
  changes: string[];
}

// ── Chat ──
export interface ChatRequest {
  message: string;
  resumeContext?: ResumeFormData;
  history?: ChatMessageData[];
}

export interface ChatResponse {
  reply: string;
  language?: string;
}

export interface ChatMessageData {
  id: string;
  role: "user" | "assistant";
  content: string;
  language?: string;
  timestamp: Date;
}

// ── Generic API Response wrapper ──
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
