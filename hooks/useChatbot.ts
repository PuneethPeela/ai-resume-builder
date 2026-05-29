"use client";

import { useState, useEffect } from "react";
import type { ChatMessageData, ApiResponse, ChatResponse } from "@/types/api";
import { useResumeStore } from "@/stores/resumeStore";
import { toast } from "sonner";

export function useChatbot() {
  const { resumeData, resumeId } = useResumeStore();
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load chat history from the database on mount/resumeId change
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!resumeId) return;
      try {
        const response = await fetch(`/api/ai/chat?resumeId=${resumeId}`);
        const result = await response.json();
        
        if (result.success && result.data && result.data.length > 0) {
          const formatted: ChatMessageData[] = result.data.map((msg: any) => ({
            id: msg.id,
            role: msg.role as "user" | "assistant",
            content: msg.content,
            language: msg.language || undefined,
            timestamp: new Date(msg.createdAt),
          }));
          setMessages(formatted);
        } else {
          // Default greeting fallback if no history exists yet
          setMessages([
            {
              id: "greeting",
              role: "assistant",
              content: "Hello! I am your AI Resume Copilot. I can review your details, suggest metrics, add action verbs, and help you customize your resume for target roles. Write in Telugu, Hindi, French, or Japanese and I will respond in kind! What section should we focus on?",
              timestamp: new Date(),
            },
          ]);
        }
      } catch (err) {
        console.error("Failed to load chat history:", err);
      }
    };

    fetchChatHistory();
  }, [resumeId]);

  const sendMessage = async (text: string) => {
    if (!text || text.trim() === "") return;

    const userMessage: ChatMessageData = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    // Update history immediately for fluid UX
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
          resumeId: resumeId || undefined,
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

  const clearHistory = async () => {
    setMessages([
      {
        id: "greeting",
        role: "assistant",
        content: "Hello! I am your AI Resume Copilot. I can review your details, suggest metrics, add action verbs, and help you customize your resume for target roles. Write in Telugu, Hindi, French, or Japanese and I will respond in kind! What section should we focus on?",
        timestamp: new Date(),
      },
    ]);

    if (resumeId) {
      try {
        const response = await fetch(`/api/ai/chat?resumeId=${resumeId}`, {
          method: "DELETE",
        });
        const result = await response.json();
        if (result.success) {
          toast.success("Chat history cleared from database.");
        }
      } catch (err) {
        console.error("Failed to delete chat history on server:", err);
      }
    }
  };

  return {
    messages,
    sendMessage,
    isLoading,
    clearHistory,
  };
}
