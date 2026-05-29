"use client";

import { useState, useEffect } from "react";
import { useAutoSave } from "@/hooks/useAutoSave";
import { useResumeStore } from "@/stores/resumeStore";
import { Loader2, Check } from "lucide-react";

export function SaveIndicator() {
  const { saveStatus } = useAutoSave();
  const lastSavedAt = useResumeStore((state) => state.lastSavedAt);

  const getRelativeTime = (date: Date | null) => {
    if (!date) return "";
    const parsedDate = new Date(date);
    const seconds = Math.floor((new Date().getTime() - parsedDate.getTime()) / 1000);
    
    if (seconds < 5) return "just now";
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ago`;
  };

  const [timeStr, setTimeStr] = useState("");

  // Helper hook to force update time string
  useEffect(() => {
    if (!lastSavedAt) return;
    setTimeStr(getRelativeTime(lastSavedAt));
    const interval = setInterval(() => {
      setTimeStr(getRelativeTime(lastSavedAt));
    }, 5000);
    return () => clearInterval(interval);
  }, [lastSavedAt]);

  switch (saveStatus) {
    case "saving":
      return (
        <div className="flex items-center gap-1.5 text-zinc-400 text-xs px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800">
          <Loader2 className="size-3 animate-spin text-violet-400" />
          <span>Saving...</span>
        </div>
      );
    case "dirty":
      return (
        <div className="flex items-center gap-1.5 text-amber-400 text-xs px-2.5 py-1 rounded-full bg-amber-500/5 border border-amber-500/20">
          <div className="size-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span>Unsaved Changes</span>
        </div>
      );
    case "saved":
    default:
      return (
        <div className="flex items-center gap-1.5 text-emerald-400 text-xs px-2.5 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/20">
          <Check className="size-3 text-emerald-400" />
          <span>Saved {timeStr ? `(${timeStr})` : ""}</span>
        </div>
      );
  }
}
