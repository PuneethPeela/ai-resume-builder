"use client";

import { useState, KeyboardEvent } from "react";
import { useResumeStore } from "@/stores/resumeStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Wrench, Sparkles } from "lucide-react";
import { toast } from "sonner";

export function SkillsSection() {
  const { resumeData, setSkills } = useResumeStore();
  const [inputValue, setInputValue] = useState("");
  const skills = resumeData?.skills || [];

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newSkill = inputValue.trim().replace(/,/g, "");
      
      if (!newSkill) return;
      
      if (skills.includes(newSkill)) {
        toast.error(`"${newSkill}" is already added!`);
        return;
      }
      
      const updatedSkills = [...skills, newSkill];
      setSkills(updatedSkills);
      setInputValue("");
    }
  };

  const handleRemove = (skillToRemove: string) => {
    const updatedSkills = skills.filter((s) => s !== skillToRemove);
    setSkills(updatedSkills);
  };

  const addCommonSkill = (skill: string) => {
    if (skills.includes(skill)) return;
    setSkills([...skills, skill]);
  };

  const suggestedSkills = [
    "React", "Node.js", "TypeScript", "Python", "SQL", "Next.js", 
    "Tailwind CSS", "Prisma", "AWS", "Git", "Docker", "REST APIs"
  ];

  return (
    <div className="space-y-4 p-4 bg-card/30 backdrop-blur-md rounded-xl border border-border/40">
      <div className="space-y-1.5">
        <Label htmlFor="skill-input" className="text-zinc-200 font-medium flex items-center gap-1.5">
          <Wrench className="size-4 text-violet-400" />
          Technical & Soft Skills
        </Label>
        <p className="text-xs text-zinc-500">
          Type a skill and press <kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400">Enter</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400">,</kbd> to add.
        </p>
      </div>

      <div className="space-y-3">
        <Input
          id="skill-input"
          placeholder="e.g. JavaScript, Docker, Project Management"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-650 focus-visible:ring-violet-500"
        />

        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 p-2.5 rounded-lg bg-zinc-950/40 border border-zinc-900">
            {skills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="px-2 py-0.5 text-xs font-semibold bg-violet-500/10 text-violet-300 hover:bg-violet-500/20 border border-violet-500/20 flex items-center gap-1 group transition-all"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemove(skill)}
                  className="text-violet-400 hover:text-red-400 transition-colors cursor-pointer"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Suggested Skills */}
      <div className="space-y-2 pt-2">
        <p className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="size-3 text-violet-400 animate-pulse" /> Popular skills to add
        </p>
        <div className="flex flex-wrap gap-1.5">
          {suggestedSkills.map((skill) => {
            const isAdded = skills.includes(skill);
            return (
              <button
                key={skill}
                type="button"
                disabled={isAdded}
                onClick={() => addCommonSkill(skill)}
                className={`text-[10px] px-2 py-0.5 rounded-full border transition-all cursor-pointer font-medium ${
                  isAdded
                    ? "bg-zinc-900/20 border-zinc-900/50 text-zinc-600 cursor-not-allowed"
                    : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 hover:bg-zinc-850"
                }`}
              >
                + {skill}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
