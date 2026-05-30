"use client";

import { useUser } from "@clerk/nextjs";
import { ResumeGrid } from "@/components/dashboard/ResumeGrid";
import { PromotionControl } from "@/components/dashboard/PromotionControl";
import { Sparkles, Terminal, ArrowRight, CheckCircle2, Target, Layout, Lightbulb } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();

  const firstName = user?.firstName || "";

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans bg-zinc-950 min-h-[calc(100vh-3.5rem)] text-zinc-100">
      {/* Top Banner */}
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
          <span>Welcome back{isLoaded && firstName ? `, ${firstName}` : ""}</span>
          <Sparkles className="size-5 text-violet-400 animate-pulse" />
        </h2>
        <p className="text-sm text-zinc-500">
          Here is your career health overview for today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* ATS Score Card */}
        <div className="p-5 rounded-2xl border border-zinc-900 bg-zinc-950/40 backdrop-blur-md flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-start">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Overall ATS Score</p>
            <Target className="size-4 text-violet-400" />
          </div>
          <div>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-3xl font-bold text-zinc-100">92</span>
              <span className="text-sm font-medium text-zinc-500 mb-1">/100</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
              <div className="h-full bg-violet-500 w-[92%] rounded-full" />
            </div>
          </div>
        </div>

        {/* AI Suggestions Card */}
        <div className="p-5 rounded-2xl border border-zinc-900 bg-zinc-950/40 backdrop-blur-md flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-start">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">AI Suggestions</p>
            <Sparkles className="size-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-3xl font-bold text-zinc-100 mb-2">14 <span className="text-sm font-medium text-zinc-500">pending reviews</span></div>
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full w-fit">
              <div className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              High impact edits available
            </div>
          </div>
        </div>

        {/* Link Views Card */}
        <div className="p-5 rounded-2xl border border-zinc-900 bg-zinc-950/40 backdrop-blur-md flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-start">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Link Views (7D)</p>
            <Layout className="size-4 text-blue-400" />
          </div>
          <div className="flex items-end justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-zinc-100">47</span>
              <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded flex items-center">
                +12%
              </span>
            </div>
            {/* Mini bar chart graphic */}
            <div className="flex items-end gap-1 h-8">
              {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                <div key={i} className="w-1.5 bg-blue-500/80 rounded-t-sm" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid workspace */}
      <div className="space-y-4">
        <div className="flex justify-between items-end border-b border-zinc-900 pb-3">
          <h3 className="text-lg font-semibold text-zinc-100 tracking-tight">Your Resumes</h3>
          <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-zinc-300 h-8 text-xs font-medium">
            View All Archive
            <ArrowRight className="size-3 ml-1" />
          </Button>
        </div>
        <ResumeGrid />
      </div>

      {/* Pro Tip Box */}
      <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 flex gap-4 items-start">
        <div className="p-2 bg-amber-500/20 rounded-lg shrink-0 mt-0.5">
          <Lightbulb className="size-5 text-amber-400" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-amber-400">Pro Tip: Action Verbs</h4>
          <p className="text-sm text-zinc-400 leading-relaxed">
            The AI Assistant noticed you frequently use the word <span className="text-zinc-300 font-medium">'Managed'</span>. Try replacing it with stronger action verbs like <span className="text-zinc-300 font-medium">'Orchestrated'</span>, <span className="text-zinc-300 font-medium">'Spearheaded'</span>, or <span className="text-zinc-300 font-medium">'Directed'</span> in your <span className="text-zinc-300 font-medium">'Frontend Engineer Lead'</span> resume to increase ATS impact scores.
          </p>
        </div>
      </div>
    </main>
  );
}
