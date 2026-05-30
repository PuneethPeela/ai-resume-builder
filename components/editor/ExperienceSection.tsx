"use client";

import { useResumeStore } from "@/stores/resumeStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Plus, Trash2, Calendar, MapPin, Briefcase, Sparkles } from "lucide-react";
import { AIBulletButton } from "./AIBulletButton";

export function ExperienceSection() {
  const { 
    resumeData, 
    addExperience, 
    updateExperience, 
    removeExperience,
    updateBullet,
    addBullet,
    removeBullet
  } = useResumeStore();

  const experiences = resumeData?.experience || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="text-sm font-semibold text-zinc-200">Work Experience</h3>
            <p className="text-xs text-zinc-500">Add details about your professional career history.</p>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-violet-600/10 border border-violet-500/20 rounded-full cursor-help group shadow-sm shadow-violet-900/10">
            <Sparkles className="size-3 text-violet-400 group-hover:animate-pulse" />
            <span className="text-[10px] font-bold text-violet-300 tracking-wide uppercase">Stitch - Design with AI</span>
          </div>
        </div>
        <Button
          type="button"
          onClick={addExperience}
          size="sm"
          className="bg-violet-600 hover:bg-violet-500 text-white font-medium flex items-center gap-1 shadow-md shadow-violet-900/20"
        >
          <Plus className="size-4" />
          Add Job
        </Button>
      </div>

      {experiences.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-zinc-800 rounded-xl bg-zinc-950/20">
          <Briefcase className="size-8 text-zinc-600 mx-auto mb-2" />
          <p className="text-sm text-zinc-400">No work experience added yet.</p>
          <Button
            type="button"
            variant="link"
            onClick={addExperience}
            className="text-violet-400 hover:text-violet-300 text-xs font-semibold mt-1"
          >
            Create your first entry
          </Button>
        </div>
      ) : (
        <Accordion className="space-y-3">
          {experiences.map((exp, index) => (
            <AccordionItem 
              key={exp.id} 
              value={exp.id}
              className="border border-border/40 bg-zinc-950/30 backdrop-blur-md rounded-xl overflow-hidden shadow-sm"
            >
              <div className="flex items-center justify-between pr-4 bg-zinc-900/30">
                <AccordionTrigger className="flex-1 py-3 px-4 hover:no-underline hover:bg-zinc-900/10 text-left">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-violet-600/10 flex items-center justify-center border border-violet-500/20 text-violet-400">
                      <Briefcase className="size-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-200 text-sm">
                        {exp.position || "Untitled Position"}
                      </p>
                      <p className="text-xs text-zinc-400">
                        {exp.company || "Company Name"} 
                        {exp.startDate ? ` • ${exp.startDate} - ${exp.current ? "Present" : exp.endDate || "Ongoing"}` : ""}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => removeExperience(exp.id)}
                  className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg shrink-0"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>

              <AccordionContent className="p-4 space-y-4 border-t border-zinc-900/50 bg-zinc-950/40">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-zinc-300 font-medium">Company Name</Label>
                    <Input
                      placeholder="Google"
                      value={exp.company || ""}
                      onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                      className="bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-violet-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-zinc-300 font-medium">Job Title / Position</Label>
                    <Input
                      placeholder="Software Engineer"
                      value={exp.position || ""}
                      onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                      className="bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-violet-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-zinc-300 font-medium flex items-center gap-1">
                      <Calendar className="size-3.5" /> Start Date
                    </Label>
                    <Input
                      placeholder="Jun 2024"
                      value={exp.startDate || ""}
                      onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                      className="bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-violet-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-zinc-300 font-medium flex items-center gap-1">
                        <Calendar className="size-3.5" /> End Date
                      </Label>
                      <label className="flex items-center gap-1.5 text-xs text-zinc-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={exp.current || false}
                          onChange={(e) => updateExperience(exp.id, { current: e.target.checked })}
                          className="rounded border-zinc-800 bg-zinc-900 text-violet-600 focus:ring-violet-500 size-3.5 accent-violet-600"
                        />
                        Currently work here
                      </label>
                    </div>
                    <Input
                      placeholder="Present"
                      disabled={exp.current}
                      value={exp.current ? "Present" : exp.endDate || ""}
                      onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                      className="bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-violet-500 disabled:opacity-40"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-zinc-300 font-medium flex items-center gap-1">
                      <MapPin className="size-3.5" /> Location
                    </Label>
                    <Input
                      placeholder="New York, NY (or Remote)"
                      value={exp.location || ""}
                      onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                      className="bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-violet-500"
                    />
                  </div>
                </div>

                {/* Bullet Points */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-zinc-300 font-semibold text-xs uppercase tracking-wider">Responsibilities & Key Achievements</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      onClick={() => addBullet(exp.id)}
                      className="h-6 text-[10px] gap-1 hover:border-zinc-700 bg-zinc-900/50 text-zinc-400"
                    >
                      <Plus className="size-3" />
                      Add Bullet
                    </Button>
                  </div>

                  <div className="space-y-2.5">
                    {exp.bullets.map((bullet, bulletIdx) => (
                      <div key={bulletIdx} className="flex gap-2 items-start">
                        <span className="text-zinc-600 text-[10px] font-bold mt-2.5 size-4 flex justify-center items-center rounded-full bg-zinc-900 border border-zinc-800 shrink-0">
                          {bulletIdx + 1}
                        </span>
                        <div className="flex-1 relative">
                          <Input
                            placeholder="Developed XYZ module using React, increasing user engagement by 20%."
                            value={bullet}
                            onChange={(e) => updateBullet(exp.id, bulletIdx, e.target.value)}
                            className="bg-zinc-900/40 border-zinc-800 text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-violet-500 pr-10 text-sm py-1.5 h-auto"
                          />
                        </div>
                        <div className="flex gap-1 items-center mt-0.5 shrink-0">
                          <AIBulletButton
                            bullet={bullet}
                            jobTitle={exp.position}
                            context={exp.company}
                            onImproved={(newText) => updateBullet(exp.id, bulletIdx, newText)}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => removeBullet(exp.id, bulletIdx)}
                            className="text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
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
