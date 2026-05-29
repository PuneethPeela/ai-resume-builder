"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useResumeStore } from "@/stores/resumeStore";
import { Target, Sparkles, Loader2, CheckCircle2, AlertTriangle, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { ApiResponse, ATSScoreResponse } from "@/types/api";

export function ATSScoreCard() {
  const { resumeData, resumeId } = useResumeStore();
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<ATSScoreResponse | null>(null);

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      toast.error("Please enter a job description to analyze!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/ai/ats-score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeData,
          jobDescription,
        }),
      });

      const data: ApiResponse<ATSScoreResponse> = await response.json();

      if (data.success && data.data) {
        setResult(data.data);
        
        // Cache ATS score in db if resumeId is present (fire-and-forget sync)
        if (resumeId) {
          fetch(`/api/resumes/${resumeId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ atsScore: data.data.score }),
          }).catch(console.error);
        }

        toast.success("ATS Compatibility analysis complete!");
      } else {
        toast.error(data.error || "Failed to analyze ATS score");
      }
    } catch (error) {
      toast.error("Network error during analysis");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400 stroke-emerald-500";
    if (score >= 60) return "text-amber-400 stroke-amber-500";
    return "text-red-400 stroke-red-500";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className="border-violet-500/20 bg-violet-500/5 hover:bg-violet-500/10 text-violet-400 hover:text-violet-300 font-semibold gap-1.5 h-8 text-xs cursor-pointer"
          />
        }
      >
        <Target className="size-4 animate-pulse text-violet-400" />
        <span>ATS Check</span>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto bg-zinc-950 border-zinc-900 text-zinc-100">
        <DialogHeader>
          <DialogTitle className="text-zinc-100 flex items-center gap-1.5">
            <Target className="size-5 text-violet-400" />
            ATS Compatibility Auditor
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Compare your resume against a target job description to verify keyword alignment and score highly in tracking systems.
          </DialogDescription>
        </DialogHeader>

        {!result ? (
          /* Step 1: Input Job Description */
          <div className="space-y-4 py-3">
            <div className="space-y-2">
              <label htmlFor="jd" className="text-xs font-semibold text-zinc-350">
                Target Job Description
              </label>
              <Textarea
                id="jd"
                placeholder="Paste the target job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-violet-500 min-h-[160px] text-xs resize-y"
              />
            </div>

            <Button
              type="button"
              onClick={handleAnalyze}
              disabled={loading || !jobDescription.trim()}
              className="w-full bg-violet-600 hover:bg-violet-500 text-white gap-1.5 font-medium cursor-pointer shadow-md shadow-violet-900/20"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Auditing Resume Compatibility...
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  Analyze Compatibility Match
                </>
              )}
            </Button>
          </div>
        ) : (
          /* Step 2: Show Score Results */
          <div className="space-y-5 py-2">
            {/* Circular Progress & Verdict */}
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-zinc-900/40 border border-zinc-900">
              {/* Circular Gauge */}
              <div className="relative size-24 shrink-0 flex items-center justify-center">
                <svg className="size-full -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#18181b"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - result.score / 100)}
                    className={getScoreColor(result.score).split(" ")[1]}
                  />
                </svg>
                <span className={`absolute font-bold text-xl ${getScoreColor(result.score).split(" ")[0]}`}>
                  {result.score}%
                </span>
              </div>

              {/* Verdict Text */}
              <div className="space-y-1 text-center sm:text-left">
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Overall Match Rating</p>
                <h4 className="font-bold text-sm text-zinc-200">
                  {result.score >= 80 ? "Highly Compatible" : result.score >= 60 ? "Moderate Fit" : "Needs Revision"}
                </h4>
                <p className="text-[11px] leading-relaxed text-zinc-400 text-justify">
                  {result.verdict}
                </p>
              </div>
            </div>

            {/* Keyword Density Badges */}
            <div className="space-y-3.5">
              {/* Matched Keywords */}
              <div className="space-y-1.5">
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="size-3.5" /> Matched Keywords ({result.presentKeywords.length})
                </p>
                <div className="flex flex-wrap gap-1">
                  {result.presentKeywords.length === 0 ? (
                    <span className="text-zinc-550 text-xs font-medium">None detected</span>
                  ) : (
                    result.presentKeywords.map((kw) => (
                      <Badge
                        key={kw}
                        variant="secondary"
                        className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] py-0.5"
                      >
                        {kw}
                      </Badge>
                    ))
                  )}
                </div>
              </div>

              {/* Missing Keywords */}
              <div className="space-y-1.5">
                <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <AlertTriangle className="size-3.5" /> Missing / Critical Keywords ({result.missingKeywords.length})
                </p>
                <div className="flex flex-wrap gap-1">
                  {result.missingKeywords.length === 0 ? (
                    <span className="text-zinc-550 text-xs font-medium">Flawless alignment!</span>
                  ) : (
                    result.missingKeywords.map((kw) => (
                      <Badge
                        key={kw}
                        variant="secondary"
                        className="bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] py-0.5"
                      >
                        {kw}
                      </Badge>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Suggestions list */}
            <div className="space-y-2 pt-2 border-t border-zinc-900">
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Strategic Recommendations</p>
              <ul className="list-disc pl-4 text-xs text-zinc-350 space-y-1.5 leading-relaxed">
                {result.suggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-3 border-t border-zinc-900">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setResult(null)}
                className="text-xs text-violet-400 hover:text-violet-300 hover:bg-violet-500/5 p-0"
              >
                ← Analyze Another Description
              </Button>
              <Button
                type="button"
                onClick={() => setOpen(false)}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs"
              >
                Close Audit
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
