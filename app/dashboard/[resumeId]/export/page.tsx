"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Share2, Download, ZoomIn, ZoomOut } from "lucide-react";
import { LivePreview } from "@/components/editor/LivePreview";
import { useResumeStore } from "@/stores/resumeStore";
import { cn } from "@/lib/utils";

export default function ExportPage({ params }: { params: { resumeId: string } }) {
  const { template, setTemplate } = useResumeStore();
  const [zoom, setZoom] = useState(100);

  const templates = [
    { id: "classic", name: "Classic" },
    { id: "modern", name: "Modern" },
    { id: "minimal", name: "Minimal" },
  ] as const;

  const handleZoomIn = () => setZoom((z) => Math.min(z + 25, 200));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 25, 50));

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-zinc-950 text-zinc-150 font-sans">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-6 py-4 shrink-0">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">Export & Analysis</h1>
          <p className="text-sm text-zinc-400">Finalize your format and review ATS compatibility before downloading.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-zinc-800 text-zinc-300 hover:text-zinc-100">
            <Share2 className="mr-2 h-4 w-4" /> Share Link
          </Button>
          <Button className="bg-violet-600 text-white hover:bg-violet-700">
            <Download className="mr-2 h-4 w-4" /> Download PDF
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Column: Settings & Stats */}
        <div className="w-full md:w-[400px] border-r border-zinc-800 bg-zinc-950/50 p-6 overflow-y-auto space-y-8 shrink-0">
          
          <section>
            <h3 className="text-sm font-medium text-zinc-400 mb-4 uppercase tracking-wider">Visual Template</h3>
            <div className="grid grid-cols-3 gap-3">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-2 rounded-lg border-2 transition-all",
                    template === t.id 
                      ? "border-violet-500 bg-violet-500/10" 
                      : "border-zinc-800 hover:border-zinc-700 bg-zinc-900"
                  )}
                >
                  <div className="w-full aspect-[1/1.4] bg-zinc-800 rounded flex items-center justify-center p-2">
                    {/* Wireframe representation */}
                    <div className="w-full h-full flex flex-col gap-1">
                      <div className="w-1/2 h-2 bg-zinc-700 rounded mx-auto mb-1"></div>
                      <div className="w-full h-1 bg-zinc-700/50 rounded"></div>
                      <div className="w-full h-1 bg-zinc-700/50 rounded"></div>
                      <div className="w-3/4 h-1 bg-zinc-700/50 rounded"></div>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-zinc-300">{t.name}</span>
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-medium text-zinc-400 mb-4 uppercase tracking-wider">Accent Color</h3>
            <div className="flex items-center gap-3">
              <button className="size-8 rounded-full bg-violet-500 ring-2 ring-violet-500 ring-offset-2 ring-offset-zinc-950"></button>
              <button className="size-8 rounded-full bg-emerald-500 hover:scale-110 transition-transform"></button>
              <button className="size-8 rounded-full bg-blue-500 hover:scale-110 transition-transform"></button>
            </div>
          </section>

          <section>
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-3 border-b border-zinc-800/50">
                <CardTitle className="text-sm font-medium text-zinc-400 flex items-center justify-between">
                  ATS Match Analysis
                  <Badge variant="outline" className="text-xs font-normal border-zinc-700 text-zinc-400">TARGET: SR. FRONTEND</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center gap-6 mb-6">
                  {/* Donut Chart */}
                  <div className="relative size-24 shrink-0 flex items-center justify-center">
                    <svg className="size-full transform -rotate-90">
                      <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-zinc-800" />
                      <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset="20.096" className="text-violet-500 drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-2xl font-bold text-zinc-100">92%</span>
                      <span className="text-[10px] text-zinc-400 uppercase">Excellent</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 flex-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Readability</span>
                      <span className="text-emerald-400 font-medium">High</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Word Count</span>
                      <span className="text-zinc-200">482</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Action Verbs</span>
                      <span className="text-zinc-200">18 found</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-zinc-400 mb-3">Suggested Keywords to Add</p>
                  <div className="flex flex-wrap gap-2">
                    {["+ GraphQL", "+ CI/CD", "+ Webpack", "+ Jest"].map((kw) => (
                      <Badge key={kw} variant="secondary" className="bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 font-normal border border-zinc-700/50">
                        {kw}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

        </div>

        {/* Right Column: Preview */}
        <div className="flex-1 bg-zinc-950 flex flex-col relative overflow-hidden">
          {/* Zoom controls */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-zinc-900/90 backdrop-blur border border-zinc-800 rounded-full px-3 py-1.5 shadow-xl">
            <button onClick={handleZoomOut} className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-full transition-colors">
              <ZoomOut className="size-4" />
            </button>
            <span className="text-xs font-medium text-zinc-300 w-12 text-center">{zoom}%</span>
            <button onClick={handleZoomIn} className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-full transition-colors">
              <ZoomIn className="size-4" />
            </button>
          </div>
          
          <div className="flex-1 overflow-auto p-8 flex items-start justify-center relative bg-zinc-900/10">
            {/* Scaling container wrapping LivePreview */}
            <div 
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }} 
              className="transition-transform duration-200 origin-top flex justify-center pb-24"
            >
              {/* Force a fixed size A4-like block for LivePreview, since it fills height 100% normally */}
              <div className="w-[210mm] h-[297mm] pointer-events-none relative">
                <LivePreview />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
