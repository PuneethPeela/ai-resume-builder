"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { ThemeToggle } from "./ThemeToggle";
import { SaveIndicator } from "./SaveIndicator";
import { ATSScoreCard } from "./ATSScoreCard";
import { PDFPreviewModal } from "../pdf/PDFPreviewModal";
import { ShareWidget } from "../editor/ShareWidget";
import { CoverLetterModal } from "../editor/CoverLetterModal";
import { 
  Sparkles, 
  ArrowLeft, 
  LayoutDashboard, 
  LogOut, 
  GraduationCap, 
  Github, 
  User,
  Settings
} from "lucide-react";
import { SettingsModal } from "./SettingsModal";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuLabel, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface UserProfile {
  name: string | null;
  email: string;
  role: string;
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const isEditor = pathname.includes("/dashboard/") && pathname !== "/dashboard";
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const result = await res.json();
      if (result.success && result.data && result.data.email !== "guest@resumeai.com") {
        setProfile(result.data);
      } else {
        setProfile(null);
      }
    } catch (err) {
      setProfile(null);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [pathname]);

  const { signOut } = useClerk();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      const result = await res.json();
      
      try {
        await signOut();
      } catch (e) {
        console.warn("Clerk sign out error (expected if bypassed):", e);
      }

      if (result.success || true) {
        toast.success("Successfully logged out!");
        router.push("/sign-in");
        router.refresh();
      } else {
        toast.error("Logout failed");
      }
    } catch (err) {
      toast.error("Network error during logout");
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-900 bg-zinc-950/70 backdrop-blur-md px-4 sm:px-6 h-14 flex items-center justify-between font-sans">
      {/* Brand logo / Back Button */}
      <div className="flex items-center gap-3">
        {isEditor ? (
          <Link href="/dashboard" passHref>
            <Button
              variant="outline"
              size="xs"
              className="text-xs text-zinc-400 hover:text-zinc-200 border-zinc-900 bg-zinc-950 gap-1 cursor-pointer"
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
              className="text-xs text-zinc-400 hover:text-zinc-200 gap-1.5 cursor-pointer"
            >
              <LayoutDashboard className="size-3.5" />
              <span>Console</span>
            </Button>
          </Link>
        )}

        <ThemeToggle />

        {profile && (
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-hidden cursor-pointer select-none">
              <div className="size-8 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-violet-950/40 border border-violet-500/30 glow-violet hover:scale-105 transition-transform duration-200 uppercase">
                {profile.name ? profile.name.slice(0, 2) : "US"}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-zinc-950/95 border border-zinc-900 shadow-2xl rounded-xl p-1.5 text-zinc-300 isolate">
              <DropdownMenuLabel className="px-2.5 py-2">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-zinc-100 truncate">{profile.name || "User"}</span>
                  <span className="text-[10px] text-zinc-500 truncate">{profile.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-zinc-900" />
              
              <DropdownMenuItem 
                onClick={() => router.push("/dashboard")} 
                className="flex items-center gap-2 hover:bg-zinc-900 text-xs py-2 rounded-lg cursor-pointer px-2.5"
              >
                <LayoutDashboard className="size-3.5 text-zinc-400" />
                <span>Dashboard</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => router.push("/dashboard")} 
                className="flex items-center gap-2 hover:bg-zinc-900 text-xs py-2 rounded-lg cursor-pointer px-2.5"
              >
                <Sparkles className="size-3.5 text-violet-400" />
                <span>AI Resume Builder</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => router.push("/dashboard/resources")} 
                className="flex items-center gap-2 hover:bg-zinc-900 text-xs py-2 rounded-lg cursor-pointer px-2.5"
              >
                <GraduationCap className="size-3.5 text-emerald-400" />
                <span>Student & Resources</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => window.open("https://github.com/PuneethPeela/ai-resume-builder", "_blank")} 
                className="flex items-center gap-2 hover:bg-zinc-900 text-xs py-2 rounded-lg cursor-pointer px-2.5"
              >
                <Github className="size-3.5 text-zinc-400" />
                <span>GitHub Repository</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="bg-zinc-900" />
              
              <DropdownMenuItem 
                onClick={() => setShowSettingsModal(true)} 
                className="flex items-center gap-2 hover:bg-zinc-900 text-xs py-2 rounded-lg cursor-pointer px-2.5"
              >
                <User className="size-3.5 text-zinc-400" />
                <span>Profile</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => setShowSettingsModal(true)} 
                className="flex items-center gap-2 hover:bg-zinc-900 text-xs py-2 rounded-lg cursor-pointer px-2.5"
              >
                <Settings className="size-3.5 text-zinc-400" />
                <span>Settings</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={handleLogout} 
                className="flex items-center gap-2 hover:bg-red-500/10 text-red-400 hover:text-red-300 text-xs py-2 rounded-lg cursor-pointer px-2.5"
              >
                <LogOut className="size-3.5" />
                <span>Log Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      
      {profile && (
        <SettingsModal 
          isOpen={showSettingsModal} 
          onClose={() => setShowSettingsModal(false)} 
          userEmail={profile.email} 
          userRole={profile.role} 
        />
      )}
    </header>
  );
}
