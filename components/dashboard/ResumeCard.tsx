"use client";

import { useRouter } from "next/navigation";
import { useDeferredValue, useState } from "react";
import { 
  FileText, 
  MoreVertical, 
  Trash2, 
  Copy, 
  Edit3, 
  Calendar, 
  Layout, 
  Target, 
  Loader2,
  ArrowRight
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { ApiResponse } from "@/types/api";

interface ResumeCardProps {
  resume: {
    id: string;
    title: string;
    template: string;
    atsScore: number | null;
    updatedAt: string;
    data: any;
  };
  onRefresh: () => void;
}

export function ResumeCard({ resume, onRefresh }: ResumeCardProps) {
  const router = useRouter();
  const [loadingAction, setLoadingAction] = useState<"duplicating" | "deleting" | null>(null);

  const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHrs / 24);

    if (diffHrs < 1) return "just now";
    if (diffHrs < 24) return `${diffHrs} hr${diffHrs > 1 ? 's' : ''} ago`;
    if (diffDays === 1) return "yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleEdit = () => {
    router.push(`/dashboard/${resume.id}`);
  };

  const handleDuplicate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoadingAction("duplicating");
    const toastId = toast.loading("Duplicating workspace...");

    try {
      const response = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${resume.title} (Copy)`,
          data: resume.data,
          template: resume.template,
        }),
      });

      const result: ApiResponse<any> = await response.json();

      if (result.success) {
        toast.success("Workspace duplicated!", { id: toastId });
        onRefresh();
      } else {
        toast.error(result.error || "Failed to duplicate resume", { id: toastId });
      }
    } catch {
      toast.error("Network error.", { id: toastId });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this resume?")) return;

    setLoadingAction("deleting");
    const toastId = toast.loading("Deleting workspace...");

    try {
      const response = await fetch(`/api/resumes/${resume.id}`, {
        method: "DELETE",
      });

      const result: ApiResponse<any> = await response.json();

      if (result.success) {
        toast.success("Workspace deleted!", { id: toastId });
        onRefresh();
      } else {
        toast.error(result.error || "Failed to delete resume", { id: toastId });
      }
    } catch {
      toast.error("Network error.", { id: toastId });
    } finally {
      setLoadingAction(null);
    }
  };

  const getATSBadgeColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25";
    if (score >= 60) return "bg-amber-500/10 text-amber-400 border border-amber-500/25";
    return "bg-red-500/10 text-red-400 border border-red-500/25";
  };

  return (
    <div
      onClick={handleEdit}
      className="group relative h-64 rounded-2xl border border-zinc-900 bg-zinc-950/40 hover:border-violet-500/30 hover:bg-zinc-900/40 flex flex-col justify-between p-4 transition-all duration-300 shadow-md cursor-pointer hover:shadow-xl backdrop-blur-md overflow-hidden"
    >
      {/* Background visual skeleton for the resume */}
      <div className="absolute top-4 right-4 w-20 h-28 bg-white/5 rounded shadow-sm border border-white/5 rotate-3 opacity-50 group-hover:rotate-6 transition-transform duration-500 pointer-events-none p-2 space-y-1.5 flex flex-col">
        <div className="h-1.5 w-3/4 bg-white/10 rounded-full"></div>
        <div className="h-1 w-full bg-white/5 rounded-full"></div>
        <div className="h-1 w-5/6 bg-white/5 rounded-full"></div>
        <div className="h-1 w-4/6 bg-white/5 rounded-full mb-1"></div>
        <div className="h-1.5 w-1/2 bg-white/10 rounded-full mt-2"></div>
        <div className="h-1 w-full bg-white/5 rounded-full"></div>
        <div className="h-1 w-full bg-white/5 rounded-full"></div>
      </div>

      {/* Top Section */}
      <div className="space-y-4 relative z-10">
        <div className="flex items-start justify-between">
          <Badge variant="outline" className={`text-[9px] py-0 px-1.5 font-bold uppercase tracking-widest ${resume.atsScore && resume.atsScore > 0 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-zinc-800 text-zinc-400 border-zinc-700"}`}>
            {resume.atsScore && resume.atsScore > 0 ? "SAVED" : "DRAFT"}
          </Badge>

          {/* Action Menu */}
          <div onClick={(e) => e.stopPropagation()} className="shrink-0 -mr-2 -mt-2">
            <DropdownMenu>
              <DropdownMenuTrigger className="text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60 rounded-lg size-8 flex items-center justify-center cursor-pointer transition-all border border-transparent outline-none">
                <MoreVertical className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-zinc-950 border-zinc-900 text-zinc-300 min-w-[140px] rounded-xl shadow-xl">
                <DropdownMenuItem onClick={handleEdit} className="flex items-center gap-2 hover:bg-zinc-900 text-xs py-2 rounded-lg cursor-pointer">
                  <Edit3 className="size-3.5 text-zinc-500" />
                  <span>Edit Draft</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDuplicate} className="flex items-center gap-2 hover:bg-zinc-900 text-xs py-2 rounded-lg cursor-pointer">
                  <Copy className="size-3.5 text-zinc-500" />
                  <span>Duplicate</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="flex items-center gap-2 hover:bg-zinc-900 text-xs py-2 rounded-lg text-red-400 hover:text-red-300 cursor-pointer">
                  <Trash2 className="size-3.5" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-zinc-100 text-base tracking-tight line-clamp-2 group-hover:text-violet-400 transition-colors pr-10">
            {resume.title}
          </h4>
          <p className="text-[10px] text-zinc-500 font-medium mt-1 flex items-center gap-1.5">
            <Calendar className="size-3" />
            Last edited {formatRelativeTime(resume.updatedAt)}
          </p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="relative z-10 space-y-3">
        {resume.atsScore ? (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`text-[10px] py-0 px-2 ${getATSBadgeColor(resume.atsScore)} flex items-center gap-1 rounded-full`}>
              <Target className="size-3" />
              <span>ATS {resume.atsScore}%</span>
            </Badge>
          </div>
        ) : (
           <div className="h-5"></div>
        )}

        <div className="flex items-center justify-between border-t border-zinc-900/60 pt-3 mt-2">
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEdit();
              }}
              className="text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Edit
            </button>
            <span className="text-zinc-800">•</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toast.success("Share link copied to clipboard!");
              }}
              className="text-xs font-semibold text-zinc-400 hover:text-violet-400 transition-colors"
            >
              Share
            </button>
          </div>
          
          <div className="size-6 rounded-full bg-zinc-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowRight className="size-3 text-zinc-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
