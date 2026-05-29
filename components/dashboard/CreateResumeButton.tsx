"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2, FilePlus2 } from "lucide-react";
import { toast } from "sonner";
import type { ApiResponse } from "@/types/api";

export function CreateResumeButton() {
  const router = useRouter();
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    setCreating(true);
    const toastId = toast.loading("Creating new resume workspace...");
    try {
      const response = await fetch("/api/resumes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "My Software Engineer Resume",
        }),
      });

      const result: ApiResponse<any> = await response.json();

      if (result.success && result.data) {
        toast.success("Workspace initialized!", { id: toastId });
        router.push(`/dashboard/${result.data.id}`);
      } else {
        toast.error(result.error || "Failed to create resume", { id: toastId });
      }
    } catch (error) {
      toast.error("Network error. Please try again.", { id: toastId });
      console.error(error);
    } finally {
      setCreating(false);
    }
  };

  return (
    <button
      type="button"
      disabled={creating}
      onClick={handleCreate}
      className="group relative h-48 rounded-2xl border-2 border-dashed border-zinc-800 hover:border-violet-500/50 bg-zinc-950/20 hover:bg-violet-500/5 flex flex-col items-center justify-center gap-3 p-6 transition-all duration-300 shadow-inner cursor-pointer"
    >
      <div className="size-12 rounded-xl bg-zinc-900 border border-zinc-850 group-hover:border-violet-500/30 flex items-center justify-center text-zinc-400 group-hover:text-violet-400 group-hover:scale-105 transition-all duration-300">
        {creating ? (
          <Loader2 className="size-5 animate-spin text-violet-400" />
        ) : (
          <Plus className="size-5" />
        )}
      </div>
      
      <div className="text-center">
        <p className="font-semibold text-sm text-zinc-300 group-hover:text-zinc-200">
          Create New Resume
        </p>
        <p className="text-xs text-zinc-500 mt-1">
          Start building from a blank slate
        </p>
      </div>
    </button>
  );
}
