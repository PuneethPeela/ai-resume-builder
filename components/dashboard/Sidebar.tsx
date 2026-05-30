"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  PencilRuler, 
  Bot, 
  Settings, 
  HelpCircle,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Builder", href: "/dashboard/builder-redirect", icon: PencilRuler },
  { name: "AI Assistant", href: "/dashboard/assistant", icon: Bot },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-zinc-900 bg-zinc-950/50 backdrop-blur-xl h-screen flex flex-col justify-between hidden md:flex shrink-0 font-sans">
      <div className="p-4 space-y-6">
        {/* Logo Area */}
        <Link href="/dashboard" className="flex items-center gap-3 px-2 mt-2">
          <div className="size-8 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-650 flex items-center justify-center text-white shadow-lg shadow-violet-900/20">
            <span className="font-bold text-lg leading-none">R</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight text-zinc-100 leading-none">ResumeOS</span>
            <span className="text-[10px] text-zinc-500 font-medium mt-0.5">Pro Builder</span>
          </div>
        </Link>

        {/* New Resume Button */}
        <div className="px-2">
          <Button className="w-full bg-violet-600/10 hover:bg-violet-600/20 text-violet-300 border border-violet-500/20 justify-start gap-2 shadow-none transition-colors">
            <Plus className="size-4" />
            <span>New Resume</span>
          </Button>
        </div>

        {/* Main Nav */}
        <nav className="space-y-1 mt-6">
          {NAV_ITEMS.map((item) => {
            // Check if active (handle nested routes like /dashboard/[resumeId])
            const isActive = 
              pathname === item.href || 
              (item.href !== "/dashboard" && pathname.startsWith(item.href)) ||
              (item.name === "Builder" && pathname.match(/^\/dashboard\/[^\/]+$/) && pathname !== "/dashboard/assistant" && pathname !== "/dashboard/settings");

            return (
              <Link key={item.name} href={item.href}>
                <div className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                  isActive 
                    ? "bg-zinc-900 text-zinc-100 border border-zinc-800/50" 
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"
                )}>
                  <item.icon className={cn("size-4", isActive ? "text-violet-400" : "text-zinc-500")} />
                  {item.name}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Area */}
      <div className="p-4 border-t border-zinc-900/50">
        <Link href="/help">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 transition-colors cursor-pointer">
            <HelpCircle className="size-4 text-zinc-500" />
            Help Center
          </div>
        </Link>
      </div>
    </aside>
  );
}
