"use client";

import { useResumeStore } from "@/stores/resumeStore";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { wordCount } from "@/lib/utils";

interface SummarySectionProps {
  onGenerateAI?: () => void;
  isGenerating?: boolean;
}

export function SummarySection({ onGenerateAI, isGenerating = false }: SummarySectionProps) {
  const { resumeData, setSummary } = useResumeStore();
  const summary = resumeData?.summary || "";
  const currentWordCount = wordCount(summary);

  return (
    <div className="space-y-3 p-4 bg-card/30 backdrop-blur-md rounded-xl border border-border/40">
      <div className="flex items-center justify-between">
        <Label htmlFor="summary" className="text-zinc-200 font-medium flex items-center gap-1.5">
          Professional Summary
        </Label>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            currentWordCount > 50 && currentWordCount < 150 
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
              : "bg-zinc-800 text-zinc-400"
          }`}>
            {currentWordCount} words
          </span>
          {onGenerateAI && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onGenerateAI}
              disabled={isGenerating}
              className="h-7 text-xs gap-1 border-violet-500/30 hover:border-violet-500 bg-violet-500/10 text-violet-400 hover:text-violet-300 font-semibold"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="size-3 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="size-3 text-violet-400 animate-pulse" />
                  Generate with AI
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      <div className="relative">
        <Textarea
          id="summary"
          placeholder="A results-driven Software Engineer with 2+ years of experience specializing in building scalable web applications. Proven track record of improving application performance by 40% and leading cross-functional teams..."
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-violet-500 min-h-[120px] resize-y"
        />
      </div>
      <p className="text-[11px] text-zinc-500">
        Tip: A good summary is 3-4 sentences long and highlights your key skills, experience, and major achievements.
      </p>
    </div>
  );
}
