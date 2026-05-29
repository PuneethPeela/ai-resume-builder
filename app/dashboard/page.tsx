"use client";

import { useUser } from "@clerk/nextjs";
import { ResumeGrid } from "@/components/dashboard/ResumeGrid";
import { Sparkles, Terminal, FileText, CheckCircle2 } from "lucide-react";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();

  const firstName = user?.firstName || "";

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans bg-zinc-950 min-h-[calc(100vh-3.5rem)] text-zinc-100">
      {/* Welcome Hero block */}
      <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-950/20 backdrop-blur-md relative overflow-hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Glow backdrop decorator */}
        <div className="absolute top-0 right-0 w-80 h-full bg-violet-600/5 blur-3xl pointer-events-none rounded-full" />
        
        <div className="space-y-1 relative z-10">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            <span>Welcome back{isLoaded && firstName ? `, ${firstName}` : ""}</span>
            <Sparkles className="size-5 text-violet-400 animate-pulse" />
          </h2>
          <p className="text-xs sm:text-sm text-zinc-550">
            Build, optimize, and tailor your professional resumes. Run AI audits to verify ATS compatibility.
          </p>
        </div>

        {/* Small Tech Credit box */}
        <div className="flex gap-4 shrink-0 text-zinc-500 text-xs font-semibold relative z-10 border-l border-zinc-900 pl-4 sm:h-10 items-center">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="size-4 text-violet-400/80" />
            <span>Next.js 14 API</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Terminal className="size-4 text-violet-400/80" />
            <span>Prisma ORM</span>
          </div>
        </div>
      </div>

      {/* Main Grid workspace */}
      <ResumeGrid />
    </main>
  );
}
