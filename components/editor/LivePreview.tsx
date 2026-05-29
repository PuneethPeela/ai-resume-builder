"use client";

import { useDeferredValue } from "react";
import { useResumeStore } from "@/stores/resumeStore";
import { ClassicTemplate } from "@/components/templates/ClassicTemplate";
import { ModernTemplate } from "@/components/templates/ModernTemplate";
import { MinimalTemplate } from "@/components/templates/MinimalTemplate";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { FileText, Sparkles } from "lucide-react";

export function LivePreview() {
  const { resumeData, template } = useResumeStore();
  
  // High performance: defer rendering updates for 300ms during typing
  const deferredData = useDeferredValue(resumeData);

  const renderTemplate = () => {
    switch (template) {
      case "modern":
        return <ModernTemplate data={deferredData} />;
      case "minimal":
        return <MinimalTemplate data={deferredData} />;
      case "classic":
      default:
        return <ClassicTemplate data={deferredData} />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden shadow-inner relative group">
      {/* Top Floating Badge */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <Badge
          variant="outline"
          className="bg-zinc-950/80 backdrop-blur-md border-zinc-800 text-zinc-400 text-[10px] font-sans flex items-center gap-1 py-1"
        >
          <FileText className="size-3 text-violet-400" />
          <span>Live Draft</span>
        </Badge>
        
        {resumeData !== deferredData && (
          <Badge
            variant="outline"
            className="bg-violet-600/10 border-violet-500/30 text-violet-400 text-[10px] font-sans flex items-center gap-1 py-1 animate-pulse"
          >
            <Sparkles className="size-3 text-violet-400" />
            <span>Updating...</span>
          </Badge>
        )}
      </div>

      {/* Main Preview Frame */}
      <ScrollArea className="flex-1 w-full h-full bg-zinc-900/10 p-4 md:p-6 flex justify-center items-start overflow-y-auto">
        <div className="w-full max-w-[210mm] shadow-2xl transition-all duration-300 rounded-xl overflow-hidden border border-zinc-200/5 hover:border-zinc-200/10">
          <div className="origin-top transition-transform duration-200 scale-100">
            {renderTemplate()}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
