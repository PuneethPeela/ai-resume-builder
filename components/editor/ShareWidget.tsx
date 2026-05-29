"use client";

import { useEffect, useState } from "react";
import { useResumeStore } from "@/stores/resumeStore";
import { Popover, PopoverContent, PopoverTrigger, PopoverHeader, PopoverTitle, PopoverDescription } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Share2, Copy, Check, Globe, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ShareWidget() {
  const { resumeId, isPublic, setIsPublic } = useResumeStore();
  const [isToggling, setIsToggling] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && resumeId) {
      setShareUrl(`${window.location.origin}/share/${resumeId}`);
    }
  }, [resumeId]);

  if (!resumeId) return null;

  const handleToggle = async () => {
    setIsToggling(true);
    const nextPublicState = !isPublic;
    try {
      const response = await fetch(`/api/resumes/${resumeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isPublic: nextPublicState,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsPublic(nextPublicState);
        if (nextPublicState) {
          toast.success("Resume is now public! Anyone with the link can view it.");
        } else {
          toast.success("Resume is now private. Public link disabled.");
        }
      } else {
        toast.error("Failed to update share settings: " + (result.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Share toggle error:", err);
      toast.error("Network error updating share settings.");
    } finally {
      setIsToggling(false);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Public link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
      toast.error("Failed to copy link.");
    }
  };

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="xs"
            className="text-xs text-zinc-400 hover:text-zinc-200 border-zinc-900 bg-zinc-950 gap-1.5 h-8 font-sans font-medium"
          />
        }
      >
        <Share2 className="size-3.5" />
        <span>Share</span>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-zinc-950 border border-zinc-900 shadow-2xl p-4 text-zinc-100 flex flex-col gap-4 rounded-xl isolate">
        <PopoverHeader className="flex flex-col gap-1 pb-1">
          <PopoverTitle className="text-zinc-100 text-sm font-bold flex items-center gap-1.5">
            <Share2 className="size-4 text-violet-400" />
            Share Resume
          </PopoverTitle>
          <PopoverDescription className="text-zinc-400 text-xs leading-relaxed">
            Generate a public page for your resume so you can share it with employers.
          </PopoverDescription>
        </PopoverHeader>

        {/* Toggle Area */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/50 border border-zinc-900/80">
          <div className="flex items-center gap-2.5">
            <div className={cn(
              "size-8 rounded-lg flex items-center justify-center transition-colors",
              isPublic ? "bg-violet-500/10 text-violet-400 border border-violet-500/20" : "bg-zinc-800/50 text-zinc-500 border border-zinc-800"
            )}>
              {isPublic ? <Globe className="size-4" /> : <Lock className="size-4" />}
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-200">Public Visibility</p>
              <p className="text-[10px] text-zinc-500 font-medium">
                {isPublic ? "Anyone can view" : "Only you can view"}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleToggle}
            disabled={isToggling}
            className={cn(
              "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed",
              isPublic ? "bg-violet-600" : "bg-zinc-800"
            )}
          >
            {isToggling ? (
              <span className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="size-3 animate-spin text-zinc-200" />
              </span>
            ) : (
              <span
                className={cn(
                  "pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
                  isPublic ? "translate-x-5" : "translate-x-0"
                )}
              />
            )}
          </button>
        </div>

        {/* Link Copy Area */}
        {isPublic && (
          <div className="space-y-2 animate-in fade-in-50 slide-in-from-top-1 duration-200">
            <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Public Share Link</label>
            <div className="flex items-center gap-1.5 bg-zinc-900/80 border border-zinc-900 rounded-lg p-1">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-transparent text-xs text-zinc-300 border-none outline-hidden px-2 select-all overflow-ellipsis whitespace-nowrap min-w-0"
              />
              <Button
                size="xs"
                onClick={copyLink}
                className="bg-violet-600 hover:bg-violet-500 text-white shrink-0 h-7 text-[10px] font-sans font-medium rounded-md gap-1"
              >
                {copied ? (
                  <>
                    <Check className="size-3" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3" />
                    <span>Copy</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
