"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, ShieldCheck, Cpu } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-3.5rem)] flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 py-16 md:py-24 bg-zinc-950 font-sans">
      {/* Background Neon Glow circles */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-violet-600/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] rounded-full bg-indigo-650/10 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left text column */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/5 text-violet-400 text-xs font-semibold uppercase tracking-wider mx-auto lg:mx-0"
          >
            <Sparkles className="size-3.5 animate-pulse text-violet-400" />
            <span>AI-Powered Resume Ecosystem</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-none text-zinc-100"
          >
            Build Your Perfect{" "}
            <span className="bg-gradient-to-r from-violet-400 via-violet-500 to-indigo-500 bg-clip-text text-transparent">
              Resume with AI
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm sm:text-base md:text-lg text-zinc-400 max-w-xl mx-auto lg:mx-0 leading-relaxed"
          >
            Optimize your application compatibility with smart ATS scorers. Rephrase experience bullets using the Google XYZ metrics formula, and customize layouts in seconds.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2"
          >
            <Link href="/sign-up" passHref>
              <Button
                size="lg"
                className="bg-violet-600 hover:bg-violet-500 text-white font-semibold gap-1.5 shadow-lg shadow-violet-950/20 hover:shadow-violet-500/20 group h-11 px-6 rounded-xl cursor-pointer"
              >
                <span>Get Started Free</span>
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            
            <Link href="/dashboard" passHref>
              <Button
                variant="outline"
                size="lg"
                className="border-zinc-800 bg-zinc-900/30 text-zinc-300 hover:bg-zinc-800/40 hover:text-zinc-150 h-11 px-6 rounded-xl cursor-pointer"
              >
                <span>See Demo Console</span>
              </Button>
            </Link>
          </motion.div>

          {/* Core assurances */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center lg:justify-start items-center gap-x-6 gap-y-2 pt-4 text-xs text-zinc-500 font-medium"
          >
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-emerald-500/80" />
              <span>100% ATS Compliant</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Cpu className="size-4 text-violet-500/85 animate-spin [animation-duration:10s]" />
              <span>Powered by Gemini 1.5 Flash</span>
            </div>
          </motion.div>
        </div>

        {/* Right side floating mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: 1 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="lg:col-span-5 flex justify-center items-center relative"
        >
          {/* Neon Ring behind Mockup */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-violet-600/10 to-indigo-650/10 blur-xl -z-10 animate-pulse [animation-duration:5s]" />
          
          <div className="w-[320px] h-[420px] rounded-2xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-xl p-5 shadow-2xl relative overflow-hidden flex flex-col justify-between group">
            {/* Header info */}
            <div className="space-y-3 pb-3 border-b border-zinc-900">
              <div className="flex items-center justify-between">
                <div className="size-7 rounded-lg bg-violet-600/15 flex items-center justify-center text-violet-400">
                  <Sparkles className="size-4 text-violet-400" />
                </div>
                <Badge variant="outline" className="bg-emerald-500/5 text-emerald-400 border-emerald-500/20 text-[9px]">
                  ATS Score: 94%
                </Badge>
              </div>
              <div>
                <div className="w-24 h-3 bg-zinc-800 rounded-full" />
                <div className="w-16 h-2 bg-zinc-900 rounded-full mt-1.5" />
              </div>
            </div>

            {/* Simulating resume text lines */}
            <div className="flex-1 py-4 space-y-4">
              <div className="space-y-1.5">
                <div className="w-12 h-2 bg-zinc-850 rounded-full" />
                <div className="w-full h-1.5 bg-zinc-900 rounded-full" />
                <div className="w-5/6 h-1.5 bg-zinc-900 rounded-full" />
              </div>

              <div className="space-y-1.5">
                <div className="w-16 h-2 bg-zinc-850 rounded-full" />
                <div className="w-full h-1.5 bg-zinc-900 rounded-full" />
                <div className="w-full h-1.5 bg-zinc-900 rounded-full" />
                <div className="w-4/5 h-1.5 bg-zinc-900 rounded-full" />
              </div>
            </div>

            {/* Bottom tools mockup */}
            <div className="pt-3 border-t border-zinc-900/60 flex items-center justify-between text-[10px] text-zinc-500 font-semibold font-mono">
              <div className="flex items-center gap-1 text-violet-400">
                <ShieldCheck className="size-3.5" />
                <span>Google XYZ Optimized</span>
              </div>
              <span className="text-zinc-650">v1.0.4</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
