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
  Loader2 
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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
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
      className="group relative h-48 rounded-2xl border border-zinc-900 bg-zinc-950/20 hover:border-zinc-800 hover:bg-zinc-900/30 flex flex-col justify-between p-5 transition-all duration-300 shadow-md cursor-pointer hover:shadow-lg"
    >
      {/* Top Details */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="size-10 rounded-xl bg-violet-600/10 border border-violet-500/20 text-violet-400 flex items-center justify-center shrink-0">
            {loadingAction ? (
              <Loader2 className="size-4.5 animate-spin text-violet-400" />
            ) : (
              <FileText className="size-4.5" />
            )}
          </div>

          {/* Action Menu dropdown */}
          <div onClick={(e) => e.stopPropagation()} className="shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger className="text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40 rounded-lg size-8 flex items-center justify-center cursor-pointer transition-all border border-transparent outline-none">
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
          <h4 className="font-bold text-zinc-200 text-sm tracking-tight line-clamp-1 group-hover:text-violet-400 transition-colors">
            {resume.title}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] text-zinc-500 font-semibold tracking-wider uppercase font-mono flex items-center gap-1">
              <Layout className="size-2.5 text-zinc-500" />
              {resume.template}
            </span>
            {resume.atsScore ? (
              <Badge variant="outline" className={`text-[9px] py-0 px-1.5 ${getATSBadgeColor(resume.atsScore)} flex items-center gap-0.5`}>
                <Target className="size-2.5" />
                <span>ATS {resume.atsScore}%</span>
              </Badge>
            ) : null}
          </div>
        </div>
      </div>

      {/* Bottom Metadata */}
      <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 pt-3 border-t border-zinc-900/60 mt-2 font-medium">
        <Calendar className="size-3 text-zinc-600" />
        <span>Updated {formatDate(resume.updatedAt)}</span>
      </div>
    </div>
  );
}
