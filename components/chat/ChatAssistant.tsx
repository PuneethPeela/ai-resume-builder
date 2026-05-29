"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, X, Send, Sparkles, Trash2, ArrowDown } from "lucide-react";
import { useChatbot } from "@/hooks/useChatbot";
import { ChatMessage } from "./ChatMessage";
import { SuggestedPrompts } from "./SuggestedPrompts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, sendMessage, isLoading, clearHistory } = useChatbot();
  const [inputMsg, setInputMsg] = useState("");
  
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive or loading changes
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 80);
    }
  }, [messages, isLoading, isOpen]);

  const handleSend = async () => {
    if (!inputMsg.trim()) return;
    const text = inputMsg;
    setInputMsg("");
    await sendMessage(text);
  };

  const handleSelectPrompt = async (text: string) => {
    await sendMessage(text);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Action Button */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="size-12 rounded-full bg-violet-600 hover:bg-violet-500 text-white flex items-center justify-center shadow-lg hover:shadow-violet-500/20 glow-violet cursor-pointer relative group transition-colors"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="size-5" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-center"
            >
              <MessageSquare className="size-5" />
              <div className="absolute -top-1.5 -right-1.5 size-3 rounded-full bg-emerald-500 border-2 border-zinc-950 animate-ping" />
              <div className="absolute -top-1.5 -right-1.5 size-3 rounded-full bg-emerald-500 border-2 border-zinc-950" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="absolute bottom-16 right-0 w-[92vw] sm:w-[380px] h-[520px] rounded-2xl bg-zinc-950/80 border border-zinc-900 shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl"
          >
            {/* Header */}
            <div className="p-3.5 bg-zinc-900/40 border-b border-zinc-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-6 rounded-lg bg-violet-600/10 flex items-center justify-center border border-violet-500/20 text-violet-400">
                  <Sparkles className="size-3.5 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-semibold text-zinc-100 text-xs tracking-wide">ResumeAI Copilot</h4>
                  <p className="text-[10px] text-zinc-500 flex items-center gap-1">
                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Multilingual Assistant
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={clearHistory}
                title="Clear chat history"
                className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4 pb-2">
                {messages.map((msg) => (
                  <ChatMessage key={msg.id} message={msg} />
                ))}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex gap-3 text-sm items-start justify-start">
                    <div className="size-7 rounded-lg bg-violet-600/10 border border-violet-500/20 text-violet-400 flex items-center justify-center shrink-0">
                      <Sparkles className="size-3.5 animate-pulse" />
                    </div>
                    <div className="p-3 rounded-2xl text-xs bg-zinc-900/40 border border-zinc-900 text-zinc-400 rounded-tl-none flex items-center gap-1.5">
                      <span>Analyzing</span>
                      <div className="flex gap-0.5 mt-1">
                        <div className="size-1 rounded-full bg-violet-400 animate-bounce [animation-delay:-0.3s]" />
                        <div className="size-1 rounded-full bg-violet-400 animate-bounce [animation-delay:-0.15s]" />
                        <div className="size-1 rounded-full bg-violet-400 animate-bounce" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Empty State suggestions */}
                {messages.length === 1 && !isLoading && (
                  <div className="pt-2 border-t border-zinc-900/60 mt-4">
                    <SuggestedPrompts onSelectPrompt={handleSelectPrompt} />
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            </ScrollArea>

            {/* Input Form */}
            <div className="p-3 bg-zinc-900/30 border-t border-zinc-900 flex items-center gap-2">
              <Input
                placeholder="Ask how to improve a bullet..."
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                disabled={isLoading}
                className="flex-1 bg-zinc-900 border-zinc-800 text-xs placeholder:text-zinc-600 focus-visible:ring-violet-500 h-9 rounded-xl py-1"
              />
              <Button
                type="button"
                onClick={handleSend}
                disabled={isLoading || !inputMsg.trim()}
                className="bg-violet-600 hover:bg-violet-500 text-white rounded-xl size-9 p-0 shrink-0 flex items-center justify-center cursor-pointer transition-colors shadow-md shadow-violet-900/20"
              >
                <Send className="size-3.5" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
