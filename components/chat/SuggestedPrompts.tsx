"use client";

import { Sparkles } from "lucide-react";

interface SuggestedPromptsProps {
  onSelectPrompt: (promptText: string) => void;
}

export function SuggestedPrompts({ onSelectPrompt }: SuggestedPromptsProps) {
  const prompts = [
    {
      text: "How can I improve the experience section of my resume?",
      lang: "English",
      label: "Improve Experience",
    },
    {
      text: "నా రెజ్యూమేని సాఫ్ట్‌వేర్ డెవలపర్ జాబ్ కోసం ఎలా మెరుగుపరచాలి?",
      lang: "తెలుగు",
      label: "జాబ్ ప్రిపరేషన్",
    },
    {
      text: "वेब डेवलपर पद के लिए मुझे अपने रिज्यूमे में क्या बदलाव करने चाहिए?",
      lang: "हिंदी",
      label: "रिज्यूमे टिप्स",
    },
    {
      text: "Rewrite my professional summary to look highly technical.",
      lang: "English",
      label: "Rewrite Summary",
    },
  ];

  return (
    <div className="space-y-2.5">
      <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1">
        <Sparkles className="size-3 text-violet-400 animate-pulse" /> Suggested Copilot Prompts
      </p>
      <div className="grid grid-cols-1 gap-2">
        {prompts.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectPrompt(p.text)}
            className="w-full text-left p-2.5 rounded-xl border border-zinc-900 bg-zinc-900/30 hover:border-zinc-800 hover:bg-zinc-800/50 transition-all text-xs text-zinc-300 group flex items-start justify-between gap-3 cursor-pointer"
          >
            <span className="font-medium group-hover:text-zinc-200 line-clamp-2 leading-relaxed">
              "{p.text}"
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-950 text-zinc-500 font-semibold uppercase tracking-wider shrink-0 mt-0.5">
              {p.lang}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
