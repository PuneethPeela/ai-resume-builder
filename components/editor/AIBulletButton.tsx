"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { ApiResponse, ImproveBulletResponse } from "@/types/api";

interface AIBulletButtonProps {
  bullet: string;
  jobTitle: string;
  context?: string;
  onImproved: (improvedText: string) => void;
}

export function AIBulletButton({ bullet, jobTitle, context, onImproved }: AIBulletButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleImprove = async () => {
    if (!bullet || bullet.trim() === "") {
      toast.error("Please enter a bullet point first!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/ai/improve-bullet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bullet,
          jobTitle: jobTitle || "Software Engineer",
          context,
        }),
      });

      const result: ApiResponse<ImproveBulletResponse> = await response.json();

      if (result.success && result.data) {
        onImproved(result.data.improved);
        toast.success("Bullet point enhanced with metrics!");
      } else {
        toast.error(result.error || "Failed to improve bullet point");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      onClick={handleImprove}
      disabled={loading}
      title="Improve bullet with AI (XYZ formula)"
      className="text-violet-400 border-violet-500/20 hover:border-violet-500 hover:bg-violet-500/20 shadow-sm"
    >
      {loading ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : (
        <Sparkles className="size-3.5 animate-pulse" />
      )}
    </Button>
  );
}
