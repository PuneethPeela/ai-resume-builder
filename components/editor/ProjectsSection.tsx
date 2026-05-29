"use client";

import { useState } from "react";
import { useResumeStore } from "@/stores/resumeStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Plus, Trash2, FolderGit2, Link2, Github, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export function ProjectsSection() {
  const { resumeData, addProject, updateProject, removeProject } = useResumeStore();
  const projects = resumeData?.projects || [];
  const [techInputs, setTechInputs] = useState<Record<string, string>>({});

  const handleTechKeyDown = (projId: string, value: string, currentTech: string[]) => {
    const trimmed = value.trim().replace(/,/g, "");
    if (!trimmed) return;
    if (currentTech.includes(trimmed)) return;
    
    updateProject(projId, { technologies: [...currentTech, trimmed] });
    setTechInputs((prev) => ({ ...prev, [projId]: "" }));
  };

  const removeTech = (projId: string, tech: string, currentTech: string[]) => {
    updateProject(projId, { technologies: currentTech.filter((t) => t !== tech) });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-zinc-200">Projects</h3>
          <p className="text-xs text-zinc-500">Showcase your personal or professional build experience.</p>
        </div>
        <Button
          type="button"
          onClick={addProject}
          size="sm"
          className="bg-violet-600 hover:bg-violet-500 text-white font-medium flex items-center gap-1 shadow-md shadow-violet-900/20"
        >
          <Plus className="size-4" />
          Add Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-zinc-800 rounded-xl bg-zinc-950/20">
          <FolderGit2 className="size-8 text-zinc-600 mx-auto mb-2" />
          <p className="text-sm text-zinc-400">No projects added yet.</p>
          <Button
            type="button"
            variant="link"
            onClick={addProject}
            className="text-violet-400 hover:text-violet-300 text-xs font-semibold mt-1"
          >
            Create your first showcase project
          </Button>
        </div>
      ) : (
        <Accordion className="space-y-3">
          {projects.map((proj) => (
            <AccordionItem 
              key={proj.id} 
              value={proj.id}
              className="border border-border/40 bg-zinc-950/30 backdrop-blur-md rounded-xl overflow-hidden shadow-sm"
            >
              <div className="flex items-center justify-between pr-4 bg-zinc-900/30">
                <AccordionTrigger className="flex-1 py-3 px-4 hover:no-underline hover:bg-zinc-900/10 text-left">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-violet-600/10 flex items-center justify-center border border-violet-500/20 text-violet-400">
                      <FolderGit2 className="size-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-200 text-sm">
                        {proj.name || "Untitled Project"}
                      </p>
                      <p className="text-xs text-zinc-400 truncate max-w-[250px]">
                        {proj.description || "Brief description..."}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => removeProject(proj.id)}
                  className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg shrink-0"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>

              <AccordionContent className="p-4 space-y-4 border-t border-zinc-900/50 bg-zinc-950/40">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-zinc-300 font-medium">Project Name</Label>
                    <Input
                      placeholder="AI Resume Builder"
                      value={proj.name || ""}
                      onChange={(e) => updateProject(proj.id, { name: e.target.value })}
                      className="bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-violet-500"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-zinc-300 font-medium">Description</Label>
                    <Textarea
                      placeholder="A modern SaaS application that uses Google Gemini to generate highly optimized, ATS-compliant resumes in real-time."
                      value={proj.description || ""}
                      onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                      className="bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-violet-500 min-h-[80px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-zinc-300 font-medium flex items-center gap-1">
                      <Link2 className="size-3.5" /> Live URL
                    </Label>
                    <Input
                      placeholder="https://ai-resumes.vercel.app"
                      value={proj.liveUrl || ""}
                      onChange={(e) => updateProject(proj.id, { liveUrl: e.target.value })}
                      className="bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-650 focus-visible:ring-violet-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-zinc-300 font-medium flex items-center gap-1">
                      <Github className="size-3.5" /> GitHub URL
                    </Label>
                    <Input
                      placeholder="https://github.com/username/ai-resumes"
                      value={proj.githubUrl || ""}
                      onChange={(e) => updateProject(proj.id, { githubUrl: e.target.value })}
                      className="bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-650 focus-visible:ring-violet-500"
                    />
                  </div>

                  {/* Technologies tags input */}
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-zinc-300 font-medium">Technologies Used</Label>
                    <div className="space-y-2">
                      <Input
                        placeholder="Type a technology (e.g. Next.js) and press Enter"
                        value={techInputs[proj.id] || ""}
                        onChange={(e) => setTechInputs((prev) => ({ ...prev, [proj.id]: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === ",") {
                            e.preventDefault();
                            handleTechKeyDown(proj.id, techInputs[proj.id] || "", proj.technologies || []);
                          }
                        }}
                        className="bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-violet-500"
                      />
                      {(proj.technologies || []).length > 0 && (
                        <div className="flex flex-wrap gap-1.5 p-2 rounded-lg bg-zinc-950/30 border border-zinc-900">
                          {proj.technologies.map((t) => (
                            <Badge
                              key={t}
                              className="px-2 py-0.5 text-[10px] font-semibold bg-zinc-800 border-zinc-700 text-zinc-300 flex items-center gap-1"
                            >
                              {t}
                              <button
                                type="button"
                                onClick={() => removeTech(proj.id, t, proj.technologies)}
                                className="text-zinc-400 hover:text-red-400 cursor-pointer"
                              >
                                <X className="size-2.5" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
