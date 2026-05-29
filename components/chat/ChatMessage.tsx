"use client";

import type { ChatMessageData } from "@/types/api";
import { User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: ChatMessageData;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  const getLanguageLabel = (lang?: string) => {
    if (!lang) return "";
    switch (lang.toLowerCase()) {
      case "te": return "Telugu";
      case "hi": return "Hindi";
      case "fr": return "French";
      case "ja": return "Japanese";
      case "en":
      default:
        return "";
    }
  };

  const langLabel = getLanguageLabel(message.language);

  return (
    <div className={cn("flex gap-3 text-sm items-start", isUser ? "justify-end" : "justify-start")}>
      {/* Icon for Assistant */}
      {!isUser && (
        <div className="size-7 rounded-lg bg-violet-600/10 border border-violet-500/20 text-violet-400 flex items-center justify-center shrink-0">
          <Sparkles className="size-3.5 animate-pulse" />
        </div>
      )}

      {/* Bubble */}
      <div className="space-y-1 max-w-[80%]">
        <div
          className={cn(
            "p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap shadow-sm",
            isUser
              ? "bg-violet-600 text-white rounded-tr-none font-medium"
              : "bg-zinc-900/60 border border-zinc-900 text-zinc-200 rounded-tl-none font-normal backdrop-blur-md"
          )}
        >
          {message.content}
        </div>
        
        {/* Metadata */}
        <div className={cn("flex items-center gap-1.5 px-1 text-[9px] text-zinc-500 font-medium", isUser ? "justify-end" : "justify-start")}>
          <span>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          {langLabel && (
            <>
              <span>•</span>
              <span className="text-violet-400">{langLabel}</span>
            </>
          )}
        </div>
      </div>

      {/* Icon for User */}
      {isUser && (
        <div className="size-7 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 flex items-center justify-center shrink-0">
          <User className="size-3.5" />
        </div>
      )}
    </div>
  );
}
