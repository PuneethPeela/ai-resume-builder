"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useResumeStore } from "@/stores/resumeStore";
import { ResumeForm } from "@/components/editor/ResumeForm";
import { LivePreview } from "@/components/editor/LivePreview";
import { ChatAssistant } from "@/components/chat/ChatAssistant";
import { Loader2, AlertCircle, FileText, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";

export default function ResumeEditorPage() {
  const params = useParams();
  const router = useRouter();
  const resumeId = params?.resumeId as string;

  const { loadResume, resetResume } = useResumeStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Guard against browser window closures/reloads when store is dirty
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const state = useResumeStore.getState();
      if (state.isDirty) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (!resumeId) return;

    const fetchResume = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/resumes/${resumeId}`);
        const result = await response.json();

        if (result.success && result.data) {
          // Load fetched resume into Zustand store
          loadResume(result.data.data, result.data.id, result.data.template, result.data.isPublic);
          toast.success(`Loaded "${result.data.title || "Resume"}"`);
        } else {
          setError(result.error || "Failed to load resume.");
          toast.error("Error: " + (result.error || "Access denied"));
        }
      } catch (err) {
        setError("Network error loading resume. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResume();

    // Reset store on unmount and flush dirty edits immediately
    return () => {
      const state = useResumeStore.getState();
      if (state.isDirty && state.resumeId) {
        // Dispatch fire-and-forget save to network
        fetch(`/api/resumes/${state.resumeId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: state.resumeData,
            template: state.template,
          }),
        }).catch((err) => console.error("Unmount save error:", err));
      }
      resetResume();
    };
  }, [resumeId, loadResume, resetResume]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-[calc(100vh-3.5rem)] items-center justify-center bg-zinc-950 text-zinc-100 gap-4">
        <div className="relative size-12 flex items-center justify-center">
          <Loader2 className="size-8 animate-spin text-violet-500" />
          <div className="absolute inset-0 rounded-full border border-violet-500/20 animate-ping" />
        </div>
        <p className="text-sm text-zinc-400 font-medium animate-pulse">
          Loading resume workspace...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-[calc(100vh-3.5rem)] items-center justify-center bg-zinc-950 text-zinc-100 px-4 text-center">
        <div className="size-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-4 scale-110">
          <AlertCircle className="size-6" />
        </div>
        <h3 className="text-lg font-bold text-zinc-200">Workspace Unavailable</h3>
        <p className="text-sm text-zinc-500 max-w-sm mt-1 mb-6">
          {error}
        </p>
        <Link href="/dashboard" passHref>
          <Button className="bg-violet-600 hover:bg-violet-500 text-white gap-2 font-medium">
            <ArrowLeft className="size-4" />
            <span>Return to Dashboard</span>
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <main className="flex flex-col md:flex-row h-[calc(100vh-3.5rem)] bg-zinc-950 overflow-hidden font-sans">
      {/* Left Form Area (45% Width) */}
      <section className="w-full md:w-[45%] h-full border-r border-zinc-900 overflow-y-auto p-4 md:p-6 space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
          <div>
            <h2 className="text-base font-bold text-zinc-100">Resume Builder</h2>
            <p className="text-xs text-zinc-500">Fill in sections below to update the live preview.</p>
          </div>
        </div>

        <ResumeForm />
      </section>

      {/* Right Preview Area (55% Width) */}
      <section className="w-full md:w-[55%] h-full p-4 md:p-6 bg-zinc-900/10">
        <LivePreview />
      </section>

      {/* Floating Chatbot Assistant */}
      <ChatAssistant />
    </main>
  );
}
