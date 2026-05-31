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
  Settings,
  Bell,
  Search,
  Menu,
  Bot
} from "lucide-react";
import { SettingsModal } from "./SettingsModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuLabel, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useResumeStore } from "@/stores/resumeStore";

interface UserProfile {
  name: string | null;
  email: string;
  role: string;
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const isEditor = pathname.includes("/dashboard/") && pathname !== "/dashboard" && !pathname.includes("/assistant") && !pathname.includes("/settings") && !pathname.includes("/export");
  const isAssistant = pathname.includes("/assistant");
  const isExport = pathname.includes("/export");
  
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
  
  const resumeData = useResumeStore(state => state.resumeData);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.success("Successfully logged out!");
      
      try {
        // Let Clerk handle the redirect natively to prevent race conditions
        signOut({ redirectUrl: "/sign-in" });
      } catch (e) {
        window.location.href = "/sign-in";
      }
    } catch (err) {
      toast.error("Network error during logout");
      window.location.href = "/sign-in";
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-900 bg-zinc-950/70 backdrop-blur-md px-4 sm:px-6 h-14 flex items-center justify-between font-sans shrink-0">
      
      {/* Mobile Menu Toggle (Visible only on small screens) */}
      <div className="md:hidden flex items-center gap-3">
        <Button variant="ghost" size="icon" className="text-zinc-400">
          <Menu className="size-5" />
        </Button>
      </div>

      {/* Left side context (Search on Dashboard, Document Title on Editor) */}
      <div className="hidden md:flex flex-1 items-center gap-3">
        {isEditor ? (
          <div className="flex items-center gap-4">
            <SaveIndicator />
            <div className="flex items-center gap-2 group cursor-text px-2 py-1 hover:bg-zinc-900 rounded-md transition-colors">
              <span className="font-semibold text-sm text-zinc-100">{resumeData.personalInfo.firstName ? `${resumeData.personalInfo.firstName}'s Resume` : "Untitled Resume"}</span>
              <Settings className="size-3 text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ) : isAssistant ? (
          <div className="flex items-center gap-2 px-2">
            <BotIcon />
            <span className="font-semibold text-sm text-zinc-100">Nexus AI</span>
          </div>
        ) : (
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
            <Input 
              placeholder="Search templates, tips..." 
              className="w-full h-8 bg-zinc-900/50 border-zinc-800 text-xs pl-9 focus-visible:ring-violet-500/50"
            />
          </div>
        )}
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-2 sm:gap-4 ml-auto">
        
        {/* Specific Editor actions */}
        {isEditor && (
          <div className="flex items-center gap-2 mr-2">
            <Button variant="ghost" size="xs" className="text-xs text-zinc-400 hover:text-zinc-100 gap-1.5 h-8">
              <Search className="size-3.5" />
            </Button>
            <Link href={`/dashboard/${useResumeStore.getState().resumeId}/export`}>
              <Button size="xs" className="text-xs bg-violet-600 hover:bg-violet-500 text-white shadow-sm h-8">
                Export PDF
              </Button>
            </Link>
          </div>
        )}

        <Button variant="ghost" size="icon" className="size-8 text-zinc-400 hover:text-zinc-100 rounded-full">
          <Bell className="size-4" />
        </Button>

        <ThemeToggle />

        {profile && (
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-hidden cursor-pointer select-none ml-1">
              <div className="size-7 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-[10px] shadow-sm shadow-violet-950/40 border border-violet-500/30 hover:scale-105 transition-transform duration-200 uppercase">
                {profile.name ? profile.name.slice(0, 2) : "US"}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-zinc-950/95 border border-zinc-900 shadow-2xl rounded-xl p-1.5 text-zinc-300 isolate" align="end">
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
                onClick={() => router.push("/dashboard/builder-redirect")} 
                className="flex items-center gap-2 hover:bg-zinc-900 text-xs py-2 rounded-lg cursor-pointer px-2.5"
              >
                <LayoutDashboard className="size-3.5 text-zinc-400" />
                <span>Application</span>
              </DropdownMenuItem>

              <DropdownMenuItem 
                onClick={() => router.push("/dashboard/resources")} 
                className="flex items-center gap-2 hover:bg-zinc-900 text-xs py-2 rounded-lg cursor-pointer px-2.5"
              >
                <GraduationCap className="size-3.5 text-zinc-400" />
                <span>Resources</span>
              </DropdownMenuItem>

              <DropdownMenuItem 
                onClick={() => router.push("/community")} 
                className="flex items-center gap-2 hover:bg-zinc-900 text-xs py-2 rounded-lg cursor-pointer px-2.5"
              >
                <Github className="size-3.5 text-zinc-400" />
                <span>Community</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => router.push("/dashboard/assistant")} 
                className="flex items-center gap-2 hover:bg-zinc-900 text-xs py-2 rounded-lg cursor-pointer px-2.5"
              >
                <BotIcon />
                <span>Nexus AI</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => router.push("/dashboard/settings")} 
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
                className="flex items-center gap-2 hover:bg-red-500/10 text-red-400 hover:text-red-300 text-xs py-2 rounded-lg cursor-pointer px-2.5 mt-1"
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

function BotIcon() {
  return <Bot className="size-3.5 text-violet-400" />;
}
