"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Award,
  BookOpen,
  Briefcase,
  Cpu,
  ChevronRight,
  ClipboardCheck,
  Clipboard,
  Terminal,
  Code,
  Layers,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  FileText,
  DollarSign,
  ChevronDown,
  UserCheck,
  Undo2,
  RefreshCw,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Types & Local Data Interfaces
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
interface CuratedJob {
  title: string;
  company: string;
  requiredSkills: string[];
  applyUrl: string;
}

interface InterviewCard {
  id: string;
  category: "Behavioral" | "Systems" | "Coding";
  question: string;
  idealAnswer: string;
}

interface CustomRole {
  title: string;
  company: string;
  matchScore: number;
  criticalSkills: string[];
  missingSkills: string[];
  applyUrl: string;
}

interface JobMatchData {
  dynamicKeywords: string[];
  customRoles: CustomRole[];
  insights: string;
}

// Pre-defined high-profile jobs to match local candidate skills against
const LOCAL_CURATED_JOBS: CuratedJob[] = [
  {
    title: "Software Engineer, Full Stack",
    company: "Stripe",
    requiredSkills: ["React", "TypeScript", "Node.js", "PostgreSQL", "REST API", "Git"],
    applyUrl: "https://stripe.com/jobs",
  },
  {
    title: "Frontend Engineer",
    company: "Vercel",
    requiredSkills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "CSS", "JavaScript"],
    applyUrl: "https://vercel.com/careers",
  },
  {
    title: "Backend Core Systems Engineer",
    company: "Supabase",
    requiredSkills: ["Node.js", "PostgreSQL", "Redis", "Go", "Docker", "REST API"],
    applyUrl: "https://supabase.com/careers",
  },
  {
    title: "DevOps & Cloud Specialist",
    company: "HashiCorp",
    requiredSkills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform", "Git"],
    applyUrl: "https://hashicorp.com/careers",
  },
  {
    title: "AI / ML Integration Engineer",
    company: "Scale AI",
    requiredSkills: ["Python", "PyTorch", "TensorFlow", "SQL", "AI", "Machine Learning"],
    applyUrl: "https://scale.com/careers",
  },
];

// Fallback Resume Data for Matcher if user has no resume in DB
const DEFAULT_FALLBACK_RESUME = {
  title: "General Tech Profile (Demo)",
  skills: ["React", "TypeScript", "Node.js", "JavaScript", "SQL", "Git", "REST API"],
  experience: [
    {
      company: "InnovateTech",
      position: "Junior Developer",
      bullets: ["Built modular React dashboard elements", "Refactored Node APIs"],
    }
  ],
  projects: [
    {
      name: "E-Commerce Pipeline",
      technologies: ["React", "Node.js", "PostgreSQL"],
    }
  ],
};

export default function ResourcesPage() {
  const { user, isLoaded: userLoaded } = useUser();
  const [activeTab, setActiveTab] = useState<"matcher" | "interview" | "playbook">("matcher");
  
  // Resume state
  const [resumes, setResumes] = useState<any[]>([]);
  const [activeResume, setActiveResume] = useState<any | null>(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [resumesLoading, setResumesLoading] = useState(true);

  // Job Matching & AI state
  const [jobMatchData, setJobMatchData] = useState<JobMatchData | null>(null);
  const [jobMatchLoading, setJobMatchLoading] = useState(false);

  // Interview prep state
  const [interviewCards, setInterviewCards] = useState<InterviewCard[]>([]);
  const [interviewLoading, setInterviewLoading] = useState(false);
  const [revealedCardId, setRevealedCardId] = useState<string | null>(null);
  
  // Playbook states
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [selectedNegotiationScenario, setSelectedNegotiationScenario] = useState<"salary" | "signing" | "remote">("salary");
  
  // Elevator pitch builder form states
  const [pitchRole, setPitchRole] = useState("Full Stack Software Engineer");
  const [pitchSkill, setPitchSkill] = useState("building high-performance React architectures");
  const [pitchProject, setPitchProject] = useState("an AI-integrated Resume tailoring platform");

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Fetch Resumes
  const fetchResumesAndData = async () => {
    setResumesLoading(true);
    try {
      const response = await fetch("/api/resumes");
      const result = await response.json();
      if (result.success && result.data && result.data.length > 0) {
        setResumes(result.data);
        // Latest updated resume is active
        const resume = result.data[0];
        setActiveResume(resume);
        setIsUsingFallback(false);
        // Fetch custom AI matches for this resume
        fetchAIJobMatch(resume.data);
        fetchAIInterviewPrep(resume.data);
      } else {
        // Use default mockup resume to let user explore page
        setActiveResume({
          title: "Demo Active Profile",
          data: DEFAULT_FALLBACK_RESUME
        });
        setIsUsingFallback(true);
        fetchAIJobMatch(DEFAULT_FALLBACK_RESUME);
        fetchAIInterviewPrep(DEFAULT_FALLBACK_RESUME);
      }
    } catch (error) {
      console.error("Failed to load resumes:", error);
      // Fallback
      setActiveResume({
        title: "Demo Active Profile (Error Fallback)",
        data: DEFAULT_FALLBACK_RESUME
      });
      setIsUsingFallback(true);
      fetchAIJobMatch(DEFAULT_FALLBACK_RESUME);
      fetchAIInterviewPrep(DEFAULT_FALLBACK_RESUME);
    } finally {
      setResumesLoading(false);
    }
  };

  // Fetch AI dynamic job matching
  const fetchAIJobMatch = async (resumeData: any) => {
    setJobMatchLoading(true);
    try {
      const response = await fetch("/api/ai/job-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeData }),
      });
      const result = await response.json();
      if (result.success) {
        setJobMatchData(result.data);
      }
    } catch (err) {
      console.error("Failed fetching dynamic job match:", err);
    } finally {
      setJobMatchLoading(false);
    }
  };

  // Fetch AI Interview prep cards
  const fetchAIInterviewPrep = async (resumeData: any) => {
    setInterviewLoading(true);
    try {
      const response = await fetch("/api/ai/interview-prep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeData }),
      });
      const result = await response.json();
      if (result.success) {
        setInterviewCards(result.data || []);
      }
    } catch (err) {
      console.error("Failed fetching custom interview prep:", err);
    } finally {
      setInterviewLoading(false);
    }
  };

  useEffect(() => {
    fetchResumesAndData();
  }, []);

  // Calculate local skill matching
  const calculateLocalMatch = (requiredSkills: string[]) => {
    if (!activeResume || !activeResume.data) return { score: 40, matched: [], missing: requiredSkills };
    
    const candidateSkills = (activeResume.data.skills || []).map((s: string) => s.toLowerCase());
    if (candidateSkills.length === 0) {
      return { score: 40, matched: [], missing: requiredSkills };
    }

    const matched = requiredSkills.filter(skill => 
      candidateSkills.some((cSkill: string) => cSkill.includes(skill.toLowerCase()) || skill.toLowerCase().includes(cSkill))
    );
    const missing = requiredSkills.filter(skill => !matched.includes(skill));
    
    // Formula: percentage of matching skills + baseline score for general background
    const score = Math.min(
      100,
      Math.max(45, Math.round((matched.length / requiredSkills.length) * 100))
    );

    return { score, matched, missing };
  };

  // Formulated dynamic elevator pitch text
  const elevatorPitchText = `Hi, I'm a developer specializing in ${pitchRole || "Software Engineering"}. I have deep expertise in ${pitchSkill || "building scalable systems"}, which I recently applied to engineer ${pitchProject || "a custom high-performance application"} that streamlined key workflows and improved efficiency. I'm looking to bring these skills and my results-driven technical focus to a high-impact engineering team.`;

  // Negotiation scenario templates
  const negotiationEmails = {
    salary: {
      subject: "Discussion regarding Offer - [Your Name]",
      body: `Dear [Hiring Manager Name/Recruiter Name],\n\nThank you so much for offering me the [Job Title] role. I am incredibly excited about the opportunity to join [Company Name] and work with the team on solving [specific technology/product problem].\n\nBefore I sign, I wanted to discuss the base salary component. Given my extensive experience in building [your skills/React/Node systems] and my successful track record of executing projects like [your project name], I would like to request if we could adjust the base salary to $[Target Salary]. This adjustment reflects the high-impact value I aim to deliver immediately to the team.\n\nI am very enthusiastic about joining and hope we can reach a mutual agreement. Thank you again for your time and support!\n\nBest regards,\n[Your Name]`
    },
    signing: {
      subject: "Finalizing Details - [Your Name]",
      body: `Dear [Hiring Manager Name/Recruiter Name],\n\nThank you for sharing the official offer for the [Job Title] position. I am highly eager to join [Company Name] and hit the ground running.\n\nTo help facilitate my transition and offset some immediate moving/relocation costs, I was wondering if [Company Name] would be open to providing a one-time signing bonus of $[Target Signing Bonus]. Taking care of these transitional logistics will allow me to focus 100% on onboarding and delivering value from day one.\n\nI am ready to finalize the paperwork as soon as we align on this detail. Thank you for your consideration!\n\nWarm regards,\n[Your Name]`
    },
    remote: {
      subject: "Workspace Structure & Details - [Your Name]",
      body: `Dear [Hiring Manager Name/Recruiter Name],\n\nI want to express my sincere gratitude for the offer to join [Company Name] as a [Job Title]. The team’s vision and projects align perfectly with my technical background.\n\nI wanted to check if we could formalize a hybrid/remote schedule within the agreement. Specifically, I would like to request [number of days, e.g. 2 days remote work per week] to optimize my coding deep-focus hours and minimize travel strain. Throughout my career, I've found this schedule offers the ideal balance for team syncs and high-velocity engineering output.\n\nI look forward to your thoughts and am excited to seal the agreement!\n\nBest regards,\n[Your Name]`
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans bg-zinc-950 min-h-[calc(100vh-3.5rem)] text-zinc-100 relative">
      {/* Glow backdrop decorators */}
      <div className="absolute top-12 left-10 w-96 h-96 bg-violet-600/5 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-600/5 blur-3xl pointer-events-none rounded-full" />

      {/* Header Panel */}
      <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-950/20 backdrop-blur-md relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-4 z-10 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-violet-400 font-medium text-xs tracking-wider uppercase">
            <Target className="size-4 animate-pulse" />
            <span>Career Resources Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            Interview & Jobs Matcher
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
            Match your skills to high-profile careers, generate Gemini custom coding/behavioral questions, and utilize advanced offer playbooks.
          </p>
        </div>

        {/* Console / Active Resume indicator */}
        <div className="flex flex-col sm:flex-row gap-3 shrink-0 items-start sm:items-center">
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl px-4 py-2 text-left space-y-0.5">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
              Active Match Engine
            </span>
            <div className="flex items-center gap-1.5 text-zinc-200 font-semibold text-xs">
              <FileText className="size-3.5 text-violet-400" />
              <span className="truncate max-w-[150px]">
                {activeResume?.title || "Loading resume..."}
              </span>
              {isUsingFallback && (
                <span className="text-[9px] bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold px-1 rounded">
                  DEMO
                </span>
              )}
            </div>
          </div>

          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="text-xs border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 text-zinc-300 gap-1.5">
              <Undo2 className="size-3.5" />
              <span>Back to Console</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Demo Warning Banner */}
      {isUsingFallback && !resumesLoading && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-300 text-xs z-10 relative"
        >
          <AlertCircle className="size-4 shrink-0 text-amber-400 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">No active resumes found in your workspace</p>
            <p className="text-amber-400/80">
              We have loaded a default engineering profile to populate matches. Create a resume on the main dashboard console to unlock personalized recommendations, custom matching, and bespoke prep cards tailored to your actual skills.
            </p>
          </div>
        </motion.div>
      )}

      {/* Main Tab Controls */}
      <div className="flex justify-center border-b border-zinc-900">
        <div className="flex space-x-1 p-1 bg-zinc-900/40 backdrop-blur border border-zinc-900/80 rounded-xl mb-[-1px]">
          <button
            onClick={() => setActiveTab("matcher")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
              activeTab === "matcher"
                ? "bg-violet-600 text-white shadow-md shadow-violet-900/30"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Briefcase className="size-4" />
            <span>Job Matcher</span>
          </button>
          
          <button
            onClick={() => setActiveTab("interview")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
              activeTab === "interview"
                ? "bg-violet-600 text-white shadow-md shadow-violet-900/30"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Cpu className="size-4" />
            <span>Interview Prep</span>
          </button>

          <button
            onClick={() => setActiveTab("playbook")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
              activeTab === "playbook"
                ? "bg-violet-600 text-white shadow-md shadow-violet-900/30"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <BookOpen className="size-4" />
            <span>Career Playbook</span>
          </button>
        </div>
      </div>

      {/* Tab Panels with AnimatePresence */}
      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: JOB LISTINGS MATCHER */}
          {activeTab === "matcher" && (
            <motion.div
              key="matcher"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6 z-10 relative"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Side: Summary & Dynamic AI Match Insights */}
                <div className="lg:col-span-1 space-y-6">
                  {/* AI Strengths & Insights Card */}
                  <div className="p-5 rounded-2xl border border-zinc-900 bg-zinc-900/20 backdrop-blur-md space-y-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="size-4 text-violet-400 animate-pulse" />
                      <h3 className="font-extrabold text-sm text-zinc-100 uppercase tracking-wider">
                        AI Match Insights
                      </h3>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed font-mono bg-zinc-950/40 p-3.5 rounded-xl border border-zinc-900">
                      {jobMatchLoading ? (
                        <span className="flex items-center gap-2">
                          <RefreshCw className="size-3.5 animate-spin text-violet-400" />
                          <span>Generating AI profile insights...</span>
                        </span>
                      ) : (
                        jobMatchData?.insights || 
                        "Your resume demonstrates robust practical skills. Highlight more open-source tools and quantitative business metrics to elevate matching results further."
                      )}
                    </p>

                    <div className="space-y-2 border-t border-zinc-900/80 pt-3">
                      <h4 className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                        Dynamic Keyword Suggestions
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {jobMatchLoading ? (
                          Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="h-5 w-16 bg-zinc-900 animate-pulse rounded-full" />
                          ))
                        ) : (
                          (jobMatchData?.dynamicKeywords || ["Next.js", "Docker", "GraphQL"]).map((word, idx) => (
                            <Badge key={idx} variant="secondary" className="bg-violet-950/20 text-violet-300 border border-violet-900/30 text-[10px] px-2 py-0.5 rounded-full font-sans gap-0.5">
                              <span>+</span>
                              <span>{word}</span>
                            </Badge>
                          ))
                        )}
                      </div>
                      <p className="text-[10px] text-zinc-500 leading-snug">
                        💡 Pick up these highly trending skills to increase interview match rates by 25%.
                      </p>
                    </div>
                  </div>

                  {/* Resume Overview Badge Stats */}
                  <div className="p-5 rounded-2xl border border-zinc-900 bg-zinc-900/20 backdrop-blur-md space-y-4">
                    <div className="flex items-center gap-2">
                      <Layers className="size-4 text-violet-400" />
                      <h3 className="font-extrabold text-sm text-zinc-100 uppercase tracking-wider">
                        Skills Profile Stats
                      </h3>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-medium">
                          <span className="text-zinc-400">Total Extracted Skills</span>
                          <span className="text-white font-mono">{activeResume?.data?.skills?.length || 0}</span>
                        </div>
                        <Progress value={Math.min(100, (activeResume?.data?.skills?.length || 0) * 8)} className="h-1 bg-zinc-900 [&>div]:bg-violet-500" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-medium">
                          <span className="text-zinc-400">Project Count</span>
                          <span className="text-white font-mono">{activeResume?.data?.projects?.length || 0}</span>
                        </div>
                        <Progress value={Math.min(100, (activeResume?.data?.projects?.length || 0) * 25)} className="h-1 bg-zinc-900 [&>div]:bg-indigo-500" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-medium">
                          <span className="text-zinc-400">Work History Length</span>
                          <span className="text-white font-mono">{activeResume?.data?.experience?.length || 0} roles</span>
                        </div>
                        <Progress value={Math.min(100, (activeResume?.data?.experience?.length || 0) * 33)} className="h-1 bg-zinc-900 [&>div]:bg-emerald-500" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Elegant Glassmorphic Matches list */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Dynamic Gemini Suggested Startup Roles */}
                  {((jobMatchData?.customRoles && jobMatchData.customRoles.length > 0) || jobMatchLoading) && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="size-4 text-violet-400 animate-pulse" />
                        <h2 className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
                          Gemini Tailored Startup Matches
                        </h2>
                      </div>
                      
                      <div className="space-y-3">
                        {jobMatchLoading ? (
                          Array.from({ length: 1 }).map((_, idx) => (
                            <div key={idx} className="h-32 bg-zinc-900/30 border border-zinc-900 rounded-2xl animate-pulse" />
                          ))
                        ) : (
                          jobMatchData?.customRoles.map((job, idx) => (
                            <div
                              key={idx}
                              className="p-5 rounded-2xl border border-violet-900/20 bg-gradient-to-r from-violet-950/10 via-zinc-950 to-zinc-950/40 backdrop-blur-sm relative overflow-hidden group hover:border-violet-600/40 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4"
                            >
                              <div className="absolute top-0 right-0 w-24 h-full bg-violet-600/5 blur-xl group-hover:bg-violet-600/10 transition-colors pointer-events-none rounded-full" />
                              
                              <div className="space-y-2 z-10">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-white text-base group-hover:text-violet-300 transition-colors">
                                      {job.title}
                                    </h3>
                                    <span className="text-[10px] bg-violet-500/10 text-violet-300 font-bold px-1.5 py-0.5 rounded border border-violet-500/20">
                                      AI Suggestion
                                    </span>
                                  </div>
                                  <p className="text-xs text-zinc-400 font-semibold">{job.company}</p>
                                </div>

                                <div className="space-y-1">
                                  <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                                    Skill Match Diagnostics
                                  </div>
                                  <div className="flex flex-wrap gap-1">
                                    {job.criticalSkills.map((s, i) => (
                                      <span key={i} className="text-[10px] bg-emerald-500/10 text-emerald-400 font-semibold px-2 py-0.5 rounded border border-emerald-500/20">
                                        ✓ {s}
                                      </span>
                                    ))}
                                    {job.missingSkills.map((s, i) => (
                                      <span key={i} className="text-[10px] bg-zinc-900 text-zinc-500 px-2 py-0.5 rounded border border-zinc-800">
                                        ✗ {s}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              <div className="shrink-0 flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 border-t md:border-t-0 border-zinc-900 pt-3 md:pt-0">
                                <div className="text-right space-y-1">
                                  <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider block">
                                    Match Quality
                                  </span>
                                  <span className="text-lg font-extrabold text-violet-400 font-mono">
                                    {job.matchScore}%
                                  </span>
                                </div>
                                <a href={job.applyUrl} target="_blank" rel="noreferrer">
                                  <Button size="xs" className="text-[11px] bg-violet-600 hover:bg-violet-500 text-white font-semibold flex items-center gap-1">
                                    <span>Apply Now</span>
                                    <ChevronRight className="size-3" />
                                  </Button>
                                </a>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {/* Standard Curated local Jobs matching list */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="size-4 text-zinc-400" />
                      <h2 className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
                        Curated Industry Matches
                      </h2>
                    </div>

                    <div className="space-y-3">
                      {LOCAL_CURATED_JOBS.map((job, idx) => {
                        const { score, matched, missing } = calculateLocalMatch(job.requiredSkills);
                        
                        return (
                          <div
                            key={idx}
                            className="p-5 rounded-2xl border border-zinc-900 bg-zinc-900/30 backdrop-blur-md group hover:border-zinc-800 hover:bg-zinc-900/40 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4"
                          >
                            <div className="space-y-3 flex-1">
                              <div className="space-y-1">
                                <h3 className="font-bold text-white text-base group-hover:text-violet-300 transition-colors">
                                  {job.title}
                                </h3>
                                <p className="text-xs text-zinc-400 font-semibold">{job.company}</p>
                              </div>

                              <div className="space-y-1.5">
                                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                                  Critical Skills Match
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {matched.map((s, i) => (
                                    <span key={i} className="text-[10px] bg-emerald-500/10 text-emerald-400 font-semibold px-2 py-0.5 rounded border border-emerald-500/20">
                                      ✓ {s}
                                    </span>
                                  ))}
                                  {missing.map((s, i) => (
                                    <span key={i} className="text-[10px] bg-zinc-900/80 text-zinc-500 px-2 py-0.5 rounded border border-zinc-800/80">
                                      ✗ {s}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="shrink-0 flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 border-t md:border-t-0 border-zinc-900 pt-3 md:pt-0">
                              <div className="text-right space-y-1">
                                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider block">
                                  Match Score
                                </span>
                                <span className={`text-lg font-extrabold font-mono ${
                                  score >= 80 ? "text-emerald-400" : score >= 60 ? "text-violet-400" : "text-zinc-500"
                                }`}>
                                  {score}%
                                </span>
                              </div>
                              <a href={job.applyUrl} target="_blank" rel="noreferrer">
                                <Button size="xs" variant="outline" className="text-[11px] border-zinc-800 bg-zinc-950/20 hover:bg-zinc-900 text-zinc-300 flex items-center gap-1">
                                  <span>Apply Portal</span>
                                  <ChevronRight className="size-3" />
                                </Button>
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 2: INTERVIEW PREPARATION */}
          {activeTab === "interview" && (
            <motion.div
              key="interview"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6 z-10 relative"
            >
              {/* Controls bar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 rounded-xl border border-zinc-900 bg-zinc-900/20 backdrop-blur-md">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Cpu className="size-4 text-violet-400" />
                    <span>Gemini Tailored Interview Prep Deck</span>
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    6 challenging custom questions generated specifically to pressure-test your resume details.
                  </p>
                </div>

                <Button
                  size="xs"
                  onClick={() => fetchAIInterviewPrep(activeResume?.data)}
                  disabled={interviewLoading}
                  className="bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs flex items-center gap-1.5"
                >
                  <RefreshCw className={`size-3 ${interviewLoading ? 'animate-spin' : ''}`} />
                  <span>Regenerate Deck</span>
                </Button>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {interviewLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-48 rounded-2xl border border-zinc-900 bg-zinc-900/10 animate-pulse p-5 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="h-4 w-20 bg-zinc-800 rounded" />
                        <div className="h-3 w-full bg-zinc-800 rounded" />
                        <div className="h-3 w-2/3 bg-zinc-800 rounded" />
                      </div>
                      <div className="h-6 w-28 bg-zinc-800 rounded" />
                    </div>
                  ))
                ) : (
                  interviewCards.map((card) => {
                    const isRevealed = revealedCardId === card.id;
                    
                    // Colors per category
                    const badgeStyles = {
                      Behavioral: "bg-blue-500/10 text-blue-400 border-blue-500/20",
                      Systems: "bg-purple-500/10 text-purple-400 border-purple-500/20",
                      Coding: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                    }[card.category] || "bg-zinc-800 text-zinc-300 border-zinc-700";

                    return (
                      <div
                        key={card.id}
                        className="p-5 rounded-2xl border border-zinc-900 bg-zinc-900/30 backdrop-blur-md hover:border-zinc-800 transition-all flex flex-col justify-between gap-4 h-full relative"
                      >
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${badgeStyles}`}>
                              {card.category}
                            </span>
                          </div>

                          <p className="font-bold text-white text-sm sm:text-base leading-relaxed">
                            {card.question}
                          </p>
                        </div>

                        <div className="space-y-3 pt-2">
                          <Button
                            size="xs"
                            variant="ghost"
                            onClick={() => setRevealedCardId(isRevealed ? null : card.id)}
                            className="text-xs text-violet-400 hover:text-violet-300 font-semibold px-0 gap-1"
                          >
                            <span>{isRevealed ? "Hide Ideal Answer" : "Reveal Ideal Answer"}</span>
                            <ChevronDown className={`size-3.5 transition-transform ${isRevealed ? "rotate-180" : ""}`} />
                          </Button>

                          {isRevealed && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-4 text-zinc-300 text-xs sm:text-sm leading-relaxed space-y-2 select-text font-sans relative overflow-hidden"
                            >
                              <div className="absolute top-2 right-2">
                                <Button
                                  size="icon-xs"
                                  variant="ghost"
                                  onClick={() => handleCopy(card.idealAnswer, card.id)}
                                  className="text-zinc-500 hover:text-zinc-300"
                                >
                                  {copiedText === card.id ? (
                                    <ClipboardCheck className="size-3.5 text-emerald-400" />
                                  ) : (
                                    <Clipboard className="size-3.5" />
                                  )}
                                </Button>
                              </div>
                              <h4 className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">
                                Recommended L5 Response Strategy
                              </h4>
                              <p className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed pr-6">
                                {card.idealAnswer}
                              </p>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 3: CAREER PLAYBOOK */}
          {activeTab === "playbook" && (
            <motion.div
              key="playbook"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6 z-10 relative"
            >
              
              {/* Left Column: Guidelines Selector & Elevator Pitch Builder */}
              <div className="lg:col-span-1 space-y-6">
                
                {/* Section Navigation Badge */}
                <div className="p-5 rounded-2xl border border-zinc-900 bg-zinc-900/20 backdrop-blur-md space-y-4">
                  <div className="flex items-center gap-2">
                    <Target className="size-4 text-violet-400" />
                    <h3 className="font-extrabold text-sm text-zinc-100 uppercase tracking-wider">
                      Interactive Playbooks
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Access standard industry methods for clearing interviews, building networks, and negotiating competitive salary offers.
                  </p>

                  <div className="space-y-1.5">
                    <a href="#offer-negotiation" className="flex items-center justify-between p-2 rounded-lg bg-zinc-950/40 hover:bg-zinc-900 text-xs font-semibold text-zinc-300 border border-zinc-900/60">
                      <span>1. Salary Offer Negotiation</span>
                      <ChevronRight className="size-3.5 text-zinc-500" />
                    </a>
                    <a href="#elevator-pitch" className="flex items-center justify-between p-2 rounded-lg bg-zinc-950/40 hover:bg-zinc-900 text-xs font-semibold text-zinc-300 border border-zinc-900/60">
                      <span>2. Elevator Pitch Constructor</span>
                      <ChevronRight className="size-3.5 text-zinc-500" />
                    </a>
                    <a href="#technical-reviews" className="flex items-center justify-between p-2 rounded-lg bg-zinc-950/40 hover:bg-zinc-900 text-xs font-semibold text-zinc-300 border border-zinc-900/60">
                      <span>3. Technical Review Strategy</span>
                      <ChevronRight className="size-3.5 text-zinc-500" />
                    </a>
                  </div>
                </div>

                {/* Interactive Elevator Pitch builder */}
                <div id="elevator-pitch" className="p-5 rounded-2xl border border-zinc-900 bg-zinc-900/20 backdrop-blur-md space-y-4">
                  <div className="flex items-center gap-2">
                    <Code className="size-4 text-violet-400" />
                    <h3 className="font-extrabold text-sm text-zinc-100 uppercase tracking-wider">
                      Elevator Pitch Builder
                    </h3>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="space-y-1">
                      <label className="text-zinc-500 font-bold uppercase text-[9px] tracking-wider block">Target Role</label>
                      <input
                        type="text"
                        value={pitchRole}
                        onChange={(e) => setPitchRole(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-200 outline-none focus:border-violet-600"
                        placeholder="e.g. Full Stack Developer"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-zinc-500 font-bold uppercase text-[9px] tracking-wider block">Signature Technical Skill</label>
                      <input
                        type="text"
                        value={pitchSkill}
                        onChange={(e) => setPitchSkill(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-200 outline-none focus:border-violet-600"
                        placeholder="e.g. building Next.js architectures"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-zinc-500 font-bold uppercase text-[9px] tracking-wider block">Major Proud Project</label>
                      <input
                        type="text"
                        value={pitchProject}
                        onChange={(e) => setPitchProject(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-200 outline-none focus:border-violet-600"
                        placeholder="e.g. an AI-powered resume match engine"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-zinc-900 pt-3">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Live Pitch Output</span>
                    <p className="text-xs text-zinc-300 leading-relaxed font-mono bg-zinc-950/60 p-3 rounded-lg border border-zinc-900 pr-8 relative">
                      {elevatorPitchText}
                      <Button
                        size="icon-xs"
                        variant="ghost"
                        onClick={() => handleCopy(elevatorPitchText, "pitch")}
                        className="absolute top-2 right-2 text-zinc-500 hover:text-zinc-300"
                      >
                        {copiedText === "pitch" ? (
                          <ClipboardCheck className="size-3.5 text-emerald-400" />
                        ) : (
                          <Clipboard className="size-3.5" />
                        )}
                      </Button>
                    </p>
                  </div>
                </div>

              </div>

              {/* Right Column: Detailed guides (Salary Negotiation & Technical Reviews) */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* 1. Salary Negotiation Playbook */}
                <div id="offer-negotiation" className="p-5 rounded-2xl border border-zinc-900 bg-zinc-900/20 backdrop-blur-md space-y-5">
                  <div className="flex items-center gap-2">
                    <DollarSign className="size-5 text-violet-400" />
                    <h3 className="font-extrabold text-sm sm:text-base text-zinc-100 uppercase tracking-wider">
                      Offer & Salary Negotiation Playbook
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-zinc-950/40 rounded-xl border border-zinc-900 text-xs space-y-1">
                      <span className="font-extrabold text-violet-400 uppercase tracking-wider text-[9px] block">Step 1: Express Gratitude</span>
                      <p className="text-zinc-400 leading-relaxed">
                        Never negotiate on the initial offer call. Always express high enthusiasm, thank them sincerely, and ask for details in writing to review thoroughly.
                      </p>
                    </div>

                    <div className="p-3 bg-zinc-950/40 rounded-xl border border-zinc-900 text-xs space-y-1">
                      <span className="font-extrabold text-violet-400 uppercase tracking-wider text-[9px] block">Step 2: Single Counter-Offer</span>
                      <p className="text-zinc-400 leading-relaxed">
                        Formulate one single, concise counter-proposal covering base salary and any sign-on/relocation requirements. Back the request with your technical skills.
                      </p>
                    </div>

                    <div className="p-3 bg-zinc-950/40 rounded-xl border border-zinc-900 text-xs space-y-1">
                      <span className="font-extrabold text-violet-400 uppercase tracking-wider text-[9px] block">Step 3: Fast Sign-Off</span>
                      <p className="text-zinc-400 leading-relaxed">
                        Explicitly state that if they can meet your requested number, you are prepared to sign the official offer letter instantly, removing all hiring friction.
                      </p>
                    </div>
                  </div>

                  {/* Negotiation Email Template Builder */}
                  <div className="space-y-3 border-t border-zinc-900 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                        Email Negotiator template builder
                      </span>
                      <div className="flex bg-zinc-950 p-0.5 rounded-lg border border-zinc-900">
                        <button
                          onClick={() => setSelectedNegotiationScenario("salary")}
                          className={`px-2 py-0.5 text-[10px] font-semibold rounded-md ${selectedNegotiationScenario === "salary" ? "bg-violet-600 text-white" : "text-zinc-500"}`}
                        >
                          Salary
                        </button>
                        <button
                          onClick={() => setSelectedNegotiationScenario("signing")}
                          className={`px-2 py-0.5 text-[10px] font-semibold rounded-md ${selectedNegotiationScenario === "signing" ? "bg-violet-600 text-white" : "text-zinc-500"}`}
                        >
                          Sign-On
                        </button>
                        <button
                          onClick={() => setSelectedNegotiationScenario("remote")}
                          className={`px-2 py-0.5 text-[10px] font-semibold rounded-md ${selectedNegotiationScenario === "remote" ? "bg-violet-600 text-white" : "text-zinc-500"}`}
                        >
                          Hybrid
                        </button>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-900 text-xs font-mono relative">
                      <div className="absolute top-2 right-2">
                        <Button
                          size="icon-xs"
                          variant="ghost"
                          onClick={() => handleCopy(`${negotiationEmails[selectedNegotiationScenario].subject}\n\n${negotiationEmails[selectedNegotiationScenario].body}`, "neg")}
                          className="text-zinc-500 hover:text-zinc-300"
                        >
                          {copiedText === "neg" ? (
                            <ClipboardCheck className="size-3.5 text-emerald-400" />
                          ) : (
                            <Clipboard className="size-3.5" />
                          )}
                        </Button>
                      </div>
                      <div className="text-zinc-500 pb-2 border-b border-zinc-900/60 mb-2">
                        Subject: {negotiationEmails[selectedNegotiationScenario].subject}
                      </div>
                      <p className="whitespace-pre-wrap text-zinc-300 leading-relaxed max-h-56 overflow-y-auto pr-6">
                        {negotiationEmails[selectedNegotiationScenario].body}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. Technical Reviews Guidelines */}
                <div id="technical-reviews" className="p-5 rounded-2xl border border-zinc-900 bg-zinc-900/20 backdrop-blur-md space-y-5">
                  <div className="flex items-center gap-2">
                    <Terminal className="size-5 text-violet-400" />
                    <h3 className="font-extrabold text-sm sm:text-base text-zinc-100 uppercase tracking-wider">
                      Technical Reviews Strategy
                    </h3>
                  </div>

                  <div className="space-y-3.5">
                    <div className="flex gap-3">
                      <div className="size-6 rounded-full bg-violet-600/10 border border-violet-600/20 text-violet-400 text-xs font-extrabold flex items-center justify-center shrink-0">1</div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-white text-xs sm:text-sm">Clarify Requirements (First 5 Minutes)</h4>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          Never start coding immediately. Ask defining questions: What is the input range? Do we need to handle duplicates? What are the memory constraints or API throughput?
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="size-6 rounded-full bg-violet-600/10 border border-violet-600/20 text-violet-400 text-xs font-extrabold flex items-center justify-center shrink-0">2</div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-white text-xs sm:text-sm">Speak Out Loud & Sandbox Strategy</h4>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          Explain your thought process. Draw simple ASCII components or architecture grids in the sandbox before typing code. Interviewers evaluate how you navigate hard blockers.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="size-6 rounded-full bg-violet-600/10 border border-violet-600/20 text-violet-400 text-xs font-extrabold flex items-center justify-center shrink-0">3</div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-white text-xs sm:text-sm">Dry Run Executions</h4>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          Step through your completed algorithm line-by-line using a simple test input (e.g. an array of 3 items). Manually update variable states so the interviewer sees your precision.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="size-6 rounded-full bg-violet-600/10 border border-violet-600/20 text-violet-400 text-xs font-extrabold flex items-center justify-center shrink-0">4</div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-white text-xs sm:text-sm">Big-O Complexity Tradeoffs</h4>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          Conclude by explicitly summarizing the Time Complexity and Space Complexity. Proactively offer how you could optimize the runtime (e.g., using a Hash Map to drop from O(N²) to O(N)).
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </main>
  );
}
