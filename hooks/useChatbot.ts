"use client";

import { useState } from "react";
import type { ChatMessageData, ApiResponse, ChatResponse } from "@/types/api";
import type { ResumeFormData } from "@/types/resume";
import { useResumeStore } from "@/stores/resumeStore";
import { toast } from "sonner";

export function useChatbot() {
  const { resumeData } = useResumeStore();
  const [messages, setMessages] = useState<ChatMessageData[]>([
    {
      id: "greeting",
      role: "assistant",
      content: "Hello! I am your AI Resume Copilot. I can review your details, suggest metrics, add action verbs, and help you customize your resume for target roles. Write in Telugu, Hindi, French, or Japanese and I will respond in kind! What section should we focus on?",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (text: string) => {
    if (!text || text.trim() === "") return;

    const userMessage: ChatMessageData = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    // Update history immediately
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          resumeContext: resumeData,
          history: messages, // Send last conversations
        }),
      });

      const result: ApiResponse<ChatResponse> = await response.json();

      if (result.success && result.data) {
        const assistantMessage: ChatMessageData = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: result.data.reply,
          language: result.data.language,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        toast.error(result.error || "Failed to get reply from AI assistant");
      }
    } catch (error) {
      toast.error("Network error connecting to AI Chat");
      console.error("Chat error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    setMessages([
      {
        id: "greeting",
        role: "assistant",
        content: "Hello! I am your AI Resume Copilot. I can review your details, suggest metrics, add action verbs, and help you customize your resume for target roles. Write in Telugu, Hindi, French, or Japanese and I will respond in kind! What section should we focus on?",
        timestamp: new Date(),
      },
    ]);
  };

  return {
    messages,
    sendMessage,
    isLoading,
    clearHistory,
  };
}
