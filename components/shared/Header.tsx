"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "./ThemeToggle";
import { SaveIndicator } from "./SaveIndicator";
import { ATSScoreCard } from "./ATSScoreCard";
import { PDFPreviewModal } from "../pdf/PDFPreviewModal";
import { ShareWidget } from "../editor/ShareWidget";
import { CoverLetterModal } from "../editor/CoverLetterModal";
import { Sparkles, ArrowLeft, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const pathname = usePathname();
  const isEditor = pathname.includes("/dashboard/") && pathname !== "/dashboard";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-900 bg-zinc-950/70 backdrop-blur-md px-4 sm:px-6 h-14 flex items-center justify-between font-sans">
      {/* Brand logo / Back Button */}
      <div className="flex items-center gap-3">
        {isEditor ? (
          <Link href="/dashboard" passHref>
            <Button
              variant="outline"
              size="xs"
              className="text-xs text-zinc-400 hover:text-zinc-200 border-zinc-900 bg-zinc-950 gap-1"
            >
              <ArrowLeft className="size-3.5" />
              <span>Dashboard</span>
            </Button>
          </Link>
        ) : (
          <Link href="/" className="flex items-center gap-1.5 group select-none">
            <div className="size-7 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-violet-900/20 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="size-4 animate-pulse text-white" />
            </div>
            <span className="font-bold text-base tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              ResumAI
            </span>
          </Link>
        )}
      </div>

      {/* Center Toolbar (Only on Editor page) */}
      {isEditor && (
        <div className="hidden md:flex items-center gap-3">
          <SaveIndicator />
        </div>
      )}

      {/* Right side controls */}
      <div className="flex items-center gap-3">
        {/* Editor controls */}
        {isEditor && (
          <div className="flex items-center gap-2 mr-1">
            <ATSScoreCard />
            <CoverLetterModal />
            <ShareWidget />
            <PDFPreviewModal />
          </div>
        )}

        {/* Standard controls */}
        {!isEditor && pathname !== "/" && (
          <Link href="/dashboard" passHref>
            <Button
              variant="ghost"
              size="xs"
              className="text-xs text-zinc-400 hover:text-zinc-200 gap-1.5"
            >
              <LayoutDashboard className="size-3.5" />
              <span>Console</span>
            </Button>
          </Link>
        )}

        <ThemeToggle />
        <div className="size-7 flex items-center justify-center shrink-0 border border-zinc-905 bg-zinc-900 rounded-full overflow-hidden shadow-sm scale-95 hover:scale-100 transition-transform">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "size-full rounded-full",
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}
