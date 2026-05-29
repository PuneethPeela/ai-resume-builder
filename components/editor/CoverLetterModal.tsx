"use client";

import { useState } from "react";
import { useResumeStore } from "@/stores/resumeStore";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Copy, Check, FileDown, Loader2, ArrowLeft, RotateCcw, FileText } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function CoverLetterModal() {
  const { resumeData, resumeId } = useResumeStore();
  const [open, setOpen] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!resumeId) return null;

  const handleGenerate = async () => {
    if (!jobDescription.trim()) {
      toast.error("Please paste a job description first.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/ai/generate-cover-letter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeData,
          jobDescription,
        }),
      });

      const result = await response.json();

      if (result.success && result.data?.coverLetter) {
        setCoverLetter(result.data.coverLetter);
        toast.success("Cover letter generated successfully!");
      } else {
        toast.error("Failed to generate cover letter: " + (result.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error generating cover letter.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(coverLetter);
      setCopied(true);
      toast.success("Cover letter copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
      toast.error("Failed to copy cover letter.");
    }
  };

  const handleDownload = () => {
    try {
      const element = document.createElement("a");
      const file = new Blob([coverLetter], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      
      const fullName = `${resumeData?.personalInfo?.firstName || ""} ${resumeData?.personalInfo?.lastName || ""}`.trim();
      const filename = `${fullName.toLowerCase().replace(/\s+/g, "_")}_cover_letter.txt`;
      
      element.download = filename;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      toast.success("Cover letter saved as .txt!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to download cover letter.");
    }
  };

  const resetGenerator = () => {
    setCoverLetter("");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => {
      setOpen(v);
      if (!v) {
        // Reset state on modal close
        setJobDescription("");
        setCoverLetter("");
      }
    }}>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="xs"
            className="text-xs text-zinc-400 hover:text-violet-400 border-zinc-900 bg-zinc-950 gap-1.5 h-8 font-sans font-medium hover:border-violet-500/30 transition-colors"
          />
        }
      >
        <Sparkles className="size-3.5 text-violet-400 animate-pulse" />
        <span>AI Letter</span>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[650px] bg-zinc-950/95 backdrop-blur-xl border border-zinc-900 text-zinc-100 shadow-2xl p-6 rounded-2xl select-none max-h-[90vh] flex flex-col justify-start">
        <DialogHeader className="space-y-1 pb-2 border-b border-zinc-900">
          <DialogTitle className="text-zinc-100 text-base font-bold flex items-center gap-2">
            <div className="size-8 rounded-lg bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0">
              <Sparkles className="size-4 text-violet-400 animate-pulse" />
            </div>
            <span>AI Cover Letter Generator</span>
          </DialogTitle>
          <DialogDescription className="text-zinc-400 text-xs">
            Generate a personalized, ATS-optimized cover letter matching your profile directly to a target role.
          </DialogDescription>
        </DialogHeader>

        {/* Modal View State */}
        {!coverLetter ? (
          /* Step 1: Input Job Description */
          <div className="flex flex-col gap-4 py-4 flex-1">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                Target Job Description
              </label>
              <Textarea
                placeholder="Paste details of the role here (e.g. Title, Company, key qualifications, requirements, or responsibilities)..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="min-h-[220px] bg-zinc-900/40 border border-zinc-900 focus-visible:ring-violet-600 text-zinc-300 placeholder:text-zinc-600 text-xs leading-relaxed rounded-xl resize-none font-sans"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleGenerate}
                disabled={isLoading || !jobDescription.trim()}
                className="bg-violet-600 hover:bg-violet-500 text-white font-medium gap-1.5 min-w-[150px] shadow-lg shadow-violet-900/20"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Analyzing & Drafting...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4" />
                    <span>Generate Cover Letter</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          /* Step 2: Show Generated Cover Letter */
          <div className="flex flex-col gap-4 py-4 flex-1 overflow-hidden">
            <div className="space-y-2 flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Generated Draft (Markdown format)
                </label>
                <button
                  onClick={resetGenerator}
                  className="text-zinc-500 hover:text-zinc-300 text-xs flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <RotateCcw className="size-3" />
                  <span>Start Over</span>
                </button>
              </div>

              {/* Cover Letter Content Box */}
              <div className="flex-1 bg-zinc-900/50 border border-zinc-900 rounded-xl p-4 overflow-y-auto max-h-[350px] select-text">
                <pre className="text-zinc-300 text-xs font-mono whitespace-pre-wrap leading-relaxed select-text font-sans scrollbar-thin">
                  {coverLetter}
                </pre>
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="flex justify-between items-center pt-2 border-t border-zinc-900 mt-1">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setCoverLetter("")}
                className="text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40 gap-1.5"
              >
                <ArrowLeft className="size-4" />
                <span>Back to Input</span>
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDownload}
                  className="border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200 gap-1.5"
                >
                  <FileDown className="size-4" />
                  <span>Download .txt</span>
                </Button>

                <Button
                  type="button"
                  onClick={handleCopy}
                  className={cn(
                    "font-medium gap-1.5 transition-all min-w-[140px] shadow-md",
                    copied ? "bg-emerald-600 hover:bg-emerald-500 text-white" : "bg-violet-600 hover:bg-violet-500 text-white"
                  )}
                >
                  {copied ? (
                    <>
                      <Check className="size-4 animate-scale" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-4" />
                      <span>Copy to Clipboard</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
