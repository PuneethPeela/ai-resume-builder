"use client";

import { useEffect, useState } from "react";
import { useResumeStore } from "@/stores/resumeStore";
import { toast } from "sonner";

export function useAutoSave() {
  const { resumeData, template, resumeId, isDirty, markSaved } = useResumeStore();
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "dirty">("saved");

  useEffect(() => {
    if (!isDirty || !resumeId) {
      if (!isDirty) setSaveStatus("saved");
      return;
    }

    setSaveStatus("dirty");

    // Debounce save operation by 5 seconds
    const timer = setTimeout(async () => {
      setSaveStatus("saving");
      try {
        const response = await fetch(`/api/resumes/${resumeId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: resumeData,
            template: template,
          }),
        });

        const result = await response.json();

        if (result.success) {
          markSaved();
          setSaveStatus("saved");
        } else {
          setSaveStatus("dirty");
          toast.error("Auto-save failed: " + (result.error || "Unknown error"));
        }
      } catch (error) {
        setSaveStatus("dirty");
        console.error("Auto-save network error:", error);
      }
    }, 5000); // 5 seconds debounce

    return () => clearTimeout(timer);
  }, [resumeData, template, resumeId, isDirty, markSaved]);

  return { saveStatus };
}
