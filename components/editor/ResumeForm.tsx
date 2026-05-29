"use client";

import { useState } from "react";
import { useResumeStore } from "@/stores/resumeStore";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { PersonalInfoSection } from "./PersonalInfoSection";
import { SummarySection } from "./SummarySection";
import { ExperienceSection } from "./ExperienceSection";
import { EducationSection } from "./EducationSection";
import { SkillsSection } from "./SkillsSection";
import { ProjectsSection } from "./ProjectsSection";
import { CertificationsSection } from "./CertificationsSection";
import { TemplateSelector } from "./TemplateSelector";
import { User, FileText, Briefcase, GraduationCap, Wrench, FolderGit2, Award, Layout, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { ApiResponse, GenerateSummaryResponse } from "@/types/api";

export function ResumeForm() {
  const { resumeData, setSummary, setSkills } = useResumeStore();
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const response = await fetch("/api/ai/generate-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeData,
        }),
      });

      const result: ApiResponse<GenerateSummaryResponse> = await response.json();

      if (result.success && result.data) {
        setSummary(result.data.summary);
        
        // Optionally seed suggested keywords if the AI recommended them and they don't already exist
        if (result.data.keywords && result.data.keywords.length > 0) {
          const currentSkills = resumeData?.skills || [];
          const mergedSkills = Array.from(new Set([...currentSkills, ...result.data.keywords.slice(0, 5)]));
          setSkills(mergedSkills);
        }

        toast.success("ATS-optimized summary generated!");
      } else {
        toast.error(result.error || "Failed to generate summary");
      }
    } catch (error) {
      toast.error("Network error generating summary. Using backup standard summary.");
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Template selector is prominently pinned at the top */}
      <TemplateSelector />

      <Accordion defaultValue={["personal-info"]} className="space-y-3">
        {/* Personal Info */}
        <AccordionItem 
          value="personal-info" 
          className="border border-zinc-800 bg-zinc-950/20 backdrop-blur-md rounded-xl overflow-hidden shadow-sm"
        >
          <AccordionTrigger className="py-3 px-4 hover:no-underline hover:bg-zinc-900/10 text-zinc-200">
            <span className="flex items-center gap-2 font-semibold text-sm">
              <User className="size-4 text-violet-400" />
              1. Contact & Personal Info
            </span>
          </AccordionTrigger>
          <AccordionContent className="p-1.5 border-t border-zinc-900/50">
            <PersonalInfoSection />
          </AccordionContent>
        </AccordionItem>

        {/* Summary */}
        <AccordionItem 
          value="summary" 
          className="border border-zinc-800 bg-zinc-950/20 backdrop-blur-md rounded-xl overflow-hidden shadow-sm"
        >
          <AccordionTrigger className="py-3 px-4 hover:no-underline hover:bg-zinc-900/10 text-zinc-200">
            <span className="flex items-center gap-2 font-semibold text-sm">
              <FileText className="size-4 text-violet-400" />
              2. Professional Summary
            </span>
          </AccordionTrigger>
          <AccordionContent className="p-1.5 border-t border-zinc-900/50">
            <SummarySection 
              onGenerateAI={handleGenerateSummary} 
              isGenerating={isGeneratingSummary} 
            />
          </AccordionContent>
        </AccordionItem>

        {/* Experience */}
        <AccordionItem 
          value="experience" 
          className="border border-zinc-800 bg-zinc-950/20 backdrop-blur-md rounded-xl overflow-hidden shadow-sm"
        >
          <AccordionTrigger className="py-3 px-4 hover:no-underline hover:bg-zinc-900/10 text-zinc-200">
            <span className="flex items-center gap-2 font-semibold text-sm">
              <Briefcase className="size-4 text-violet-400" />
              3. Work Experience
            </span>
          </AccordionTrigger>
          <AccordionContent className="p-3 border-t border-zinc-900/50">
            <ExperienceSection />
          </AccordionContent>
        </AccordionItem>

        {/* Education */}
        <AccordionItem 
          value="education" 
          className="border border-zinc-800 bg-zinc-950/20 backdrop-blur-md rounded-xl overflow-hidden shadow-sm"
        >
          <AccordionTrigger className="py-3 px-4 hover:no-underline hover:bg-zinc-900/10 text-zinc-200">
            <span className="flex items-center gap-2 font-semibold text-sm">
              <GraduationCap className="size-4 text-violet-400" />
              4. Education History
            </span>
          </AccordionTrigger>
          <AccordionContent className="p-3 border-t border-zinc-900/50">
            <EducationSection />
          </AccordionContent>
        </AccordionItem>

        {/* Skills */}
        <AccordionItem 
          value="skills" 
          className="border border-zinc-800 bg-zinc-950/20 backdrop-blur-md rounded-xl overflow-hidden shadow-sm"
        >
          <AccordionTrigger className="py-3 px-4 hover:no-underline hover:bg-zinc-900/10 text-zinc-200">
            <span className="flex items-center gap-2 font-semibold text-sm">
              <Wrench className="size-4 text-violet-400" />
              5. Skills Inventory
            </span>
          </AccordionTrigger>
          <AccordionContent className="p-1.5 border-t border-zinc-900/50">
            <SkillsSection />
          </AccordionContent>
        </AccordionItem>

        {/* Projects */}
        <AccordionItem 
          value="projects" 
          className="border border-zinc-800 bg-zinc-950/20 backdrop-blur-md rounded-xl overflow-hidden shadow-sm"
        >
          <AccordionTrigger className="py-3 px-4 hover:no-underline hover:bg-zinc-900/10 text-zinc-200">
            <span className="flex items-center gap-2 font-semibold text-sm">
              <FolderGit2 className="size-4 text-violet-400" />
              6. Showcase Projects
            </span>
          </AccordionTrigger>
          <AccordionContent className="p-3 border-t border-zinc-900/50">
            <ProjectsSection />
          </AccordionContent>
        </AccordionItem>

        {/* Certifications */}
        <AccordionItem 
          value="certifications" 
          className="border border-zinc-800 bg-zinc-950/20 backdrop-blur-md rounded-xl overflow-hidden shadow-sm"
        >
          <AccordionTrigger className="py-3 px-4 hover:no-underline hover:bg-zinc-900/10 text-zinc-200">
            <span className="flex items-center gap-2 font-semibold text-sm">
              <Award className="size-4 text-violet-400" />
              7. Certifications & Credentials
            </span>
          </AccordionTrigger>
          <AccordionContent className="p-3 border-t border-zinc-900/50">
            <CertificationsSection />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
