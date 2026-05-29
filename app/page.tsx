"use client";

import { useAuth, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Footer } from "@/components/landing/Footer";
import { Sparkles, LayoutDashboard, ArrowRight } from "lucide-react";

export default function LandingPage() {
  const { isSignedIn } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-150 font-sans selection:bg-violet-600/30 selection:text-violet-200">
      
      {/* Landing Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-900/60 bg-zinc-950/70 backdrop-blur-md px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-1.5 select-none">
          <div className="size-6.5 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-650 flex items-center justify-center text-white shadow-md shadow-violet-900/20">
            <Sparkles className="size-3.5 text-white" />
          </div>
          <span className="font-bold text-sm tracking-tight text-zinc-150">
            ResumAI
          </span>
        </div>

        <div className="flex items-center gap-3">
          {isSignedIn ? (
            /* Clerk Authenticated State */
            <>
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
              <div className="size-7 flex items-center justify-center border border-zinc-905 bg-zinc-900 rounded-full overflow-hidden shadow-sm scale-95 hover:scale-100 transition-transform">
                <UserButton />
              </div>
            </>
          ) : (
            /* Clerk Unauthenticated State */
            <>
              <Link href="/sign-in" passHref>
                <Button
                  variant="ghost"
                  size="xs"
                  className="text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up" passHref>
                <Button
                  size="xs"
                  className="bg-violet-600 hover:bg-violet-500 text-white font-medium text-xs rounded-lg px-3 py-1 shadow-md shadow-violet-950/20"
                >
                  <span>Register</span>
                </Button>
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Composed sections */}
      <Hero />
      <Features />
      <HowItWorks />
      <Footer />
      
    </div>
  );
}
