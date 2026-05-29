"use client";

import { useState } from "react";
import { ClassicTemplate } from "@/components/templates/ClassicTemplate";
import { ModernTemplate } from "@/components/templates/ModernTemplate";
import { MinimalTemplate } from "@/components/templates/MinimalTemplate";
import type { ResumeFormData, TemplateName } from "@/types/resume";
import { Sparkles, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface SharePageClientProps {
  resumeData: ResumeFormData;
  template: TemplateName;
  resumeId: string;
}

export function SharePageClient({ resumeData, template, resumeId }: SharePageClientProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Portfolio link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
      toast.error("Failed to copy link.");
    }
  };

  const renderTemplate = () => {
    switch (template) {
      case "modern":
        return <ModernTemplate data={resumeData} />;
      case "minimal":
        return <MinimalTemplate data={resumeData} />;
      case "classic":
      default:
        return <ClassicTemplate data={resumeData} />;
    }
  };

  return (
    <div className="w-full min-h-screen py-10 px-4 md:px-8 bg-zinc-950 flex flex-col justify-start items-center relative">
      {/* Resume Container */}
      <div className="w-full max-w-4xl shadow-2xl rounded-2xl overflow-hidden border border-zinc-900 bg-white">
        {renderTemplate()}
      </div>

      {/* Floating Hosted on ResumAI Badge */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-zinc-950/90 backdrop-blur-md border border-zinc-800/80 rounded-full px-4 py-2 shadow-xl shadow-black/50 select-none scale-100 hover:scale-[1.02] transition-transform duration-200">
        <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-medium">
          <div className="size-5 rounded-md bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shrink-0">
            <Sparkles className="size-3 text-white animate-pulse" />
          </div>
          <span>Hosted on <span className="font-bold text-zinc-100">ResumAI</span></span>
        </div>
        <div className="h-4 w-px bg-zinc-800" />
        <button
          onClick={handleCopy}
          className="text-zinc-400 hover:text-zinc-200 transition-colors flex items-center justify-center cursor-pointer"
          title="Copy Resume Link"
        >
          {copied ? (
            <Check className="size-3.5 text-emerald-400" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}
