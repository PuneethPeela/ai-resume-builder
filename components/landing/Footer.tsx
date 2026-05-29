"use client";

import { Badge } from "@/components/ui/badge";
import { Sparkles, Heart } from "lucide-react";
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const techStack = [
    "Next.js 14 (App Router)", "React 18", "TypeScript", "Google Gemini AI",
    "Tailwind CSS 4", "Prisma ORM", "Clerk OAuth", "Zustand State"
  ];

  return (
    <footer className="w-full border-t border-zinc-900 bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Brand description block */}
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center gap-1.5 select-none">
            <div className="size-6.5 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-650 flex items-center justify-center text-white shadow-md">
              <Sparkles className="size-3.5 text-white" />
            </div>
            <span className="font-bold text-sm tracking-tight text-zinc-150">
              ResumeAI Builder
            </span>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed max-w-sm">
            ResumeAI is a premium, state-of-the-art SaaS workspace engineered to help applicants craft perfect resumes. Synthesize summaries, align metrics, and audit compatibility match instantly.
          </p>
        </div>

        {/* Tech Stack badges list */}
        <div className="space-y-3">
          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Technology Stack</p>
          <div className="flex flex-wrap gap-1">
            {techStack.map((tech) => (
              <Badge
                key={tech}
                variant="outline"
                className="text-[9px] py-0.5 px-2 bg-zinc-900/40 border-zinc-800 text-zinc-400 font-semibold"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        {/* Links / Credits */}
        <div className="space-y-3">
          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Project & Credits</p>
          <div className="space-y-2 text-xs text-zinc-400">
            <p className="flex items-center gap-1">
              <span>Built with</span>
              <Heart className="size-3 text-red-500 fill-red-500 animate-pulse" />
              <span>by</span>
              <span className="font-bold text-violet-400">Puneeth Peela</span>
            </p>
            <p className="text-[10px] text-zinc-500">
              Internship Selection Assignment • Full-stack
            </p>
            <div className="flex gap-4 pt-1.5 text-[11px] font-semibold text-zinc-500">
              <Link href="/dashboard" className="hover:text-violet-400 transition-colors">
                Workspace
              </Link>
              <span>•</span>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-violet-400 transition-colors">
                GitHub Repo
              </a>
            </div>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 text-[10px] text-zinc-650">
        <p>© {currentYear} ResumeAI. All rights reserved.</p>
        <p className="font-medium">Crafted in Hyderabad, India • Selection Candidate</p>
      </div>
    </footer>
  );
}
export default Footer;
