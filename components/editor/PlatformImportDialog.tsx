"use client";

import React, { useState } from "react";
import { 
  Github, 
  Linkedin, 
  Sparkles, 
  Loader2, 
  Check, 
  AlertCircle, 
  Layers, 
  RefreshCcw,
  Info
} from "lucide-react";
import { toast } from "sonner";
import { useResumeStore } from "@/stores/resumeStore";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { ResumeFormData } from "@/types/resume";

export function PlatformImportDialog() {
  const { resumeData, setResumeData } = useResumeStore();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"github" | "linkedin">("github");
  const [githubUser, setGithubUser] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [importMode, setImportMode] = useState<"overwrite" | "merge">("overwrite");
  
  // Scraper Simulation Status Messages
  const [statusMessage, setStatusMessage] = useState("");

  const runLinkedInSimulation = async (username: string) => {
    const steps = [
      "Establishing handshake with direct scraping proxy...",
      `Locating profile node: linkedin.com/in/${username}...`,
      "Extracting structured header & location data...",
      "Analyzing employment timelines & historical bullet points...",
      "Translating raw accomplishments to ATS-optimized statements...",
      "Finalizing structured ResumeFormData schema..."
    ];

    for (let i = 0; i < steps.length; i++) {
      setStatusMessage(steps[i]);
      // progress timings
      await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 500));
    }
  };

  const handleImport = async () => {
    if (activeTab === "github" && !githubUser.trim()) {
      toast.error("Please enter a GitHub username!");
      return;
    }
    if (activeTab === "linkedin" && !linkedinUrl.trim()) {
      toast.error("Please enter a LinkedIn profile URL!");
      return;
    }

    setLoading(true);
    setStatusMessage("Connecting to API endpoint...");
    const toastId = toast.loading("Initializing profile extraction...");

    try {
      let body: any = { platform: activeTab };
      if (activeTab === "github") {
        body.username = githubUser.trim();
      } else {
        body.url = linkedinUrl.trim();
        // Fire simulated scraper updates
        let handle = "candidate";
        try {
          const parts = linkedinUrl.trim().replace(/\/$/, "").split("/");
          handle = parts[parts.length - 1]?.split("?")[0] || "candidate";
        } catch {}
        runLinkedInSimulation(handle);
      }

      const response = await fetch("/api/resumes/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (result.success && result.data) {
        const importedData: ResumeFormData = result.data;
        
        if (importMode === "overwrite") {
          setResumeData(importedData);
          toast.success("Resume fully pre-populated from profile!", { id: toastId });
        } else {
          // Merge logic
          const currentSkills = resumeData?.skills || [];
          const mergedSkills = Array.from(new Set([...currentSkills, ...importedData.skills]));
          
          const currentProjects = resumeData?.projects || [];
          const mergedProjects = [...currentProjects, ...importedData.projects.map(p => ({
            ...p,
            id: crypto.randomUUID() // ensure unique IDs
          }))];

          const mergedResume: ResumeFormData = {
            ...resumeData,
            skills: mergedSkills,
            projects: mergedProjects,
            // also grab github / linkedin links if the current resume doesn't have them
            personalInfo: {
              ...resumeData.personalInfo,
              github: resumeData.personalInfo.github || importedData.personalInfo.github,
              linkedin: resumeData.personalInfo.linkedin || importedData.personalInfo.linkedin,
              portfolio: resumeData.personalInfo.portfolio || importedData.personalInfo.portfolio,
            }
          };

          setResumeData(mergedResume);
          toast.success("Successfully merged projects & skills into your resume!", { id: toastId });
        }
        
        setOpen(false);
        setGithubUser("");
        setLinkedinUrl("");
      } else {
        toast.error(result.error || "Platform import failed.", { id: toastId });
      }
    } catch (error) {
      toast.error("Network error during platform import.", { id: toastId });
      console.error(error);
    } finally {
      setLoading(false);
      setStatusMessage("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border border-zinc-800 bg-zinc-950/40 hover:bg-zinc-900/60 text-zinc-300 hover:text-zinc-200 transition-all duration-200 text-xs font-semibold shadow-inner cursor-pointer"
          >
            <Layers className="size-3.5 text-violet-400" />
            <span>Import from GitHub / LinkedIn</span>
          </button>
        }
      />

      <DialogContent className="sm:max-w-md border border-zinc-800 bg-zinc-950 text-zinc-100 p-6 rounded-2xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2 text-zinc-100">
            <Sparkles className="size-4 text-violet-400" />
            <span>Platform Profile Importer</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-400">
            Automatically ingest summary details, skills, repositories, and historical work directly into your active resume workspace.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2 space-y-4">
          {/* Platform Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={(val) => setActiveTab(val as any)}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 bg-zinc-900/60 p-1 rounded-xl border border-zinc-900">
              <TabsTrigger
                value="github"
                disabled={loading}
                className="rounded-lg text-xs py-2 data-[state=active]:bg-zinc-800 data-[state=active]:text-violet-400 text-zinc-400"
              >
                <div className="flex items-center gap-1.5 justify-center">
                  <Github className="size-3.5" />
                  <span>GitHub</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="linkedin"
                disabled={loading}
                className="rounded-lg text-xs py-2 data-[state=active]:bg-zinc-800 data-[state=active]:text-violet-400 text-zinc-400"
              >
                <div className="flex items-center gap-1.5 justify-center">
                  <Linkedin className="size-3.5" />
                  <span>LinkedIn</span>
                </div>
              </TabsTrigger>
            </TabsList>

            {/* GitHub Tab */}
            <TabsContent value="github" className="pt-3 space-y-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                  GitHub Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={githubUser}
                    onChange={(e) => setGithubUser(e.target.value)}
                    placeholder="e.g. torvalds"
                    disabled={loading}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-900/50 border border-zinc-800 focus:border-violet-500/50 outline-none text-zinc-100 text-xs transition-colors placeholder:text-zinc-600"
                  />
                  <Github className="absolute left-3 top-2.5 size-4 text-zinc-500" />
                </div>
                <p className="text-[10px] text-zinc-500">
                  Fetches your avatar, bio, top starred public repos (as projects), and principal languages.
                </p>
              </div>
            </TabsContent>

            {/* LinkedIn Tab */}
            <TabsContent value="linkedin" className="pt-3 space-y-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                  LinkedIn Profile URL
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="e.g. https://linkedin.com/in/alexrivera"
                    disabled={loading}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-900/50 border border-zinc-800 focus:border-violet-500/50 outline-none text-zinc-100 text-xs transition-colors placeholder:text-zinc-600"
                  />
                  <Linkedin className="absolute left-3 top-2.5 size-4 text-zinc-500" />
                </div>
                <p className="text-[10px] text-zinc-500">
                  Simulates a direct profile scraping node to assemble a robust corporate work history and summary.
                </p>
              </div>
            </TabsContent>
          </Tabs>

          {/* Import Method Toggle */}
          <div className="border border-zinc-900 bg-zinc-950/50 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1">
                <Info className="size-3 text-violet-400" />
                <span>Import Strategy</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={loading}
                onClick={() => setImportMode("overwrite")}
                className={`p-2 rounded-lg border text-left flex flex-col justify-between h-16 transition-all duration-200 cursor-pointer ${
                  importMode === "overwrite"
                    ? "border-violet-500/50 bg-violet-500/5 text-zinc-200"
                    : "border-zinc-900 bg-zinc-900/20 text-zinc-500 hover:bg-zinc-900/40"
                }`}
              >
                <span className="text-[10px] font-bold">Overwrite Entirely</span>
                <span className="text-[8px] text-zinc-500 leading-normal">
                  Replaces all existing text, experience, and projects.
                </span>
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => setImportMode("merge")}
                className={`p-2 rounded-lg border text-left flex flex-col justify-between h-16 transition-all duration-200 cursor-pointer ${
                  importMode === "merge"
                    ? "border-violet-500/50 bg-violet-500/5 text-zinc-200"
                    : "border-zinc-900 bg-zinc-900/20 text-zinc-500 hover:bg-zinc-900/40"
                }`}
              >
                <span className="text-[10px] font-bold">Merge Projects & Skills</span>
                <span className="text-[8px] text-zinc-500 leading-normal">
                  Appends new repos/skills without deleting current history.
                </span>
              </button>
            </div>
          </div>

          {/* Animated Loading steps */}
          {loading && (
            <div className="p-3.5 border border-violet-950 bg-violet-950/10 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-violet-400">
                <Loader2 className="size-3.5 animate-spin" />
                <span>Extracting platform profile...</span>
              </div>
              <p className="text-[10px] text-zinc-400 leading-relaxed italic animate-pulse">
                {statusMessage}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 mt-1">
          <DialogClose
            render={
              <Button variant="ghost" className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 text-xs" disabled={loading}>
                Close
              </Button>
            }
          />
          <Button
            onClick={handleImport}
            disabled={loading}
            className="bg-violet-600 hover:bg-violet-500 text-zinc-100 font-semibold text-xs flex items-center gap-1.5"
          >
            {loading ? (
              <>
                <Loader2 className="size-3 animate-spin" />
                <span>Importing...</span>
              </>
            ) : (
              <>
                <RefreshCcw className="size-3" />
                <span>Start Import</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
