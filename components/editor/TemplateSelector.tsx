"use client";

import { useResumeStore } from "@/stores/resumeStore";
import { TemplateName } from "@/types/resume";
import { cn } from "@/lib/utils";
import { Layout, Check, AlignLeft, Grid, FileText } from "lucide-react";

export function TemplateSelector() {
  const { template, setTemplate } = useResumeStore();

  const templates: { id: TemplateName; name: string; desc: string; icon: React.ReactNode; previewBg: string }[] = [
    {
      id: "classic",
      name: "Classic",
      desc: "Traditional academic/serif layout. Perfect for finance, law, or research roles.",
      icon: <AlignLeft className="size-4 text-violet-400" />,
      previewBg: "classic-preview",
    },
    {
      id: "modern",
      name: "Modern Sidebar",
      desc: "Two-column design with a highlighted sidebar. Best for creative, marketing & tech roles.",
      icon: <Grid className="size-4 text-violet-400" />,
      previewBg: "modern-preview",
    },
    {
      id: "minimal",
      name: "Minimal",
      desc: "Generous margins, clean fonts, minimal decoration. Highly elegant and ATS-friendly.",
      icon: <FileText className="size-4 text-violet-400" />,
      previewBg: "minimal-preview",
    },
  ];

  return (
    <div className="space-y-4 p-4 bg-card/30 backdrop-blur-md rounded-xl border border-border/40">
      <div className="flex items-center gap-2">
        <Layout className="size-4 text-violet-400" />
        <h3 className="text-sm font-semibold text-zinc-200">Resume Templates</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {templates.map((tpl) => {
          const isSelected = template === tpl.id;
          return (
            <button
              key={tpl.id}
              type="button"
              onClick={() => setTemplate(tpl.id)}
              className={cn(
                "group relative text-left p-3.5 rounded-xl border transition-all duration-300 flex flex-col justify-between h-auto cursor-pointer",
                isSelected
                  ? "bg-violet-600/10 border-violet-500/80 shadow-md shadow-violet-900/10 text-zinc-100"
                  : "bg-zinc-900/40 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200"
              )}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-semibold text-sm">
                    {tpl.icon}
                    <span className={isSelected ? "text-zinc-100" : "text-zinc-300"}>{tpl.name}</span>
                  </div>
                  {isSelected && (
                    <div className="size-4 rounded-full bg-violet-600 flex items-center justify-center text-white scale-110">
                      <Check className="size-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>
                <p className="text-[11px] leading-relaxed text-zinc-500 group-hover:text-zinc-400">
                  {tpl.desc}
                </p>
              </div>

              {/* Tiny design simulation */}
              <div className="mt-3.5 h-12 w-full bg-zinc-950/60 rounded-md border border-zinc-900 flex items-stretch overflow-hidden">
                {tpl.id === "classic" && (
                  <div className="flex flex-col flex-1 p-1.5 space-y-1">
                    <div className="w-12 h-1 bg-zinc-700 mx-auto rounded-full" />
                    <div className="w-8 h-0.5 bg-zinc-800 mx-auto rounded-full" />
                    <div className="w-full h-1 bg-zinc-900 rounded-full" />
                    <div className="flex justify-between gap-1 mt-1">
                      <div className="flex-1 space-y-0.5">
                        <div className="w-full h-0.5 bg-zinc-800 rounded-full" />
                        <div className="w-5/6 h-0.5 bg-zinc-800 rounded-full" />
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <div className="w-full h-0.5 bg-zinc-800 rounded-full" />
                        <div className="w-3/4 h-0.5 bg-zinc-800 rounded-full" />
                      </div>
                    </div>
                  </div>
                )}
                {tpl.id === "modern" && (
                  <div className="flex flex-1">
                    <div className="w-1/3 bg-violet-950/20 border-r border-zinc-900 p-1.5 space-y-1">
                      <div className="size-3 rounded-full bg-zinc-800" />
                      <div className="w-full h-0.5 bg-zinc-800 rounded-full" />
                      <div className="w-full h-0.5 bg-zinc-800 rounded-full" />
                    </div>
                    <div className="flex-1 p-1.5 space-y-1.5">
                      <div className="w-10 h-1 bg-zinc-700 rounded-full" />
                      <div className="space-y-0.5">
                        <div className="w-full h-0.5 bg-zinc-800 rounded-full" />
                        <div className="w-5/6 h-0.5 bg-zinc-800 rounded-full" />
                      </div>
                    </div>
                  </div>
                )}
                {tpl.id === "minimal" && (
                  <div className="flex flex-col flex-1 p-1.5 space-y-1">
                    <div className="w-8 h-1 bg-zinc-700 rounded-full" />
                    <div className="w-full h-0.5 bg-zinc-800 rounded-full" />
                    <div className="w-5/6 h-0.5 bg-zinc-850 rounded-full" />
                    <div className="w-4/5 h-0.5 bg-zinc-850 rounded-full" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
