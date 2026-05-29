"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid Hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="size-8 text-zinc-400 bg-zinc-900/40 border border-zinc-800/40 rounded-lg">
        <Sun className="size-4 opacity-30" />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark" || theme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="size-8 text-zinc-400 hover:text-zinc-205 hover:bg-zinc-800/40 bg-zinc-900/40 border border-zinc-800/40 rounded-lg transition-transform duration-300 active:scale-95"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? (
        <Sun className="size-4 text-amber-400 transition-all duration-300 rotate-0 scale-100" />
      ) : (
        <Moon className="size-4 text-violet-400 transition-all duration-300 rotate-0 scale-100" />
      )}
    </Button>
  );
}
