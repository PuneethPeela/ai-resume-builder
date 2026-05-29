"use client";

import { useEffect, useState } from "react";
import { ResumeCard } from "./ResumeCard";
import { CreateResumeButton } from "./CreateResumeButton";
import { Skeleton } from "@/components/ui/skeleton";
import { FilePlus2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ResumeGrid() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/resumes");
      const result = await response.json();
      if (result.success) {
        setResumes(result.data || []);
      }
    } catch (error) {
      console.error("Failed to load resumes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Render 4 Skeleton cards */}
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="h-48 rounded-2xl border border-zinc-900 bg-zinc-950/20 p-5 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <Skeleton className="size-10 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4 rounded" />
                <Skeleton className="h-3 w-1/2 rounded" />
              </div>
            </div>
            <Skeleton className="h-3 w-1/3 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {resumes.length > 0 && (
        <div className="flex justify-between items-center">
          <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">
            Your Workspace ({resumes.length})
          </p>
          <Button
            variant="ghost"
            size="xs"
            onClick={fetchResumes}
            className="text-[10px] text-zinc-500 hover:text-zinc-300 gap-1"
          >
            <RefreshCw className="size-3" />
            <span>Reload</span>
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Create new button always sits first */}
        <CreateResumeButton />

        {/* Existing resumes list */}
        {resumes.map((resume) => (
          <ResumeCard
            key={resume.id}
            resume={resume}
            onRefresh={fetchResumes}
          />
        ))}
      </div>
    </div>
  );
}
