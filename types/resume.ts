// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Resume Data Types — shared across frontend + API
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  photoUrl?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
  location?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  achievements?: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface ResumeFormData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  certifications: Certification[];
  sectionOrder: string[];
}

export type TemplateName = "classic" | "modern" | "minimal";

export const DEFAULT_SECTION_ORDER = [
  "summary",
  "experience",
  "education",
  "skills",
  "projects",
  "certifications",
];

export const EMPTY_RESUME: ResumeFormData = {
  personalInfo: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    portfolio: "",
  },
  summary: "",
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  sectionOrder: DEFAULT_SECTION_ORDER,
};

export const createEmptyExperience = (): Experience => ({
  id: crypto.randomUUID(),
  company: "",
  position: "",
  startDate: "",
  endDate: "",
  current: false,
  bullets: [""],
  location: "",
});

export const createEmptyEducation = (): Education => ({
  id: crypto.randomUUID(),
  institution: "",
  degree: "",
  field: "",
  startDate: "",
  endDate: "",
  gpa: "",
  achievements: [],
});

export const createEmptyProject = (): Project => ({
  id: crypto.randomUUID(),
  name: "",
  description: "",
  technologies: [],
  liveUrl: "",
  githubUrl: "",
});

export const createEmptyCertification = (): Certification => ({
  id: crypto.randomUUID(),
  name: "",
  issuer: "",
  date: "",
  url: "",
});
