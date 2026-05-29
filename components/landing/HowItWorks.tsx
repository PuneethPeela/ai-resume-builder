"use client";

import { motion } from "framer-motion";
import { ClipboardList, Sparkles, FileDown } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      num: "01",
      icon: <ClipboardList className="size-6 text-violet-400" />,
      title: "Provide Career Info",
      desc: "Fill in your background, experiences, and academic achievements. Our dynamic, collapsible editor compiles drafts immediately.",
    },
    {
      num: "02",
      icon: <Sparkles className="size-6 text-violet-400 animate-pulse" />,
      title: "Optimize & Audit",
      desc: "Invoke Google Gemini AI to refine your bullet points using the XYZ formula, synthesize ATS-compliant summaries, and run matching compatibility tests.",
    },
    {
      num: "03",
      icon: <FileDown className="size-6 text-violet-400" />,
      title: "Download Print-Ready PDF",
      desc: "Choose from classic, modern, or minimal templates. Compile high-resolution vector PDF formats locally in the browser with one click.",
    },
  ];

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-zinc-950 font-sans relative">
      <div className="max-w-7xl mx-auto w-full space-y-16 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-100">
            Three Steps to a{" "}
            <span className="bg-gradient-to-r from-violet-400 to-indigo-500 bg-clip-text text-transparent">
              Perfect Application
            </span>
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            A fast, secure, and intuitive workflow that turns raw experience details into professional hiring tools.
          </p>
        </div>

        {/* Steps Horizontal Flow */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
          
          {/* Connector dashed line for desktop */}
          <div className="hidden lg:block absolute top-16 left-32 right-32 h-[2px] border-t-2 border-dashed border-zinc-800 -z-10" />

          {steps.map((s, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="flex flex-col items-center text-center space-y-4 group relative"
            >
              {/* Icon Container with Step Badge */}
              <div className="relative">
                <div className="size-16 rounded-2xl bg-zinc-900 border border-zinc-800 group-hover:border-violet-500/30 flex items-center justify-center shadow-lg group-hover:scale-105 transition-all duration-300">
                  {s.icon}
                </div>
                {/* Number Circle Badge */}
                <div className="absolute -top-2.5 -right-2.5 size-7 rounded-full bg-violet-600 text-white font-bold text-xs flex items-center justify-center shadow-md shadow-violet-900/40 border border-zinc-950 scale-105">
                  {s.num}
                </div>
              </div>

              {/* Text details */}
              <div className="space-y-2 max-w-xs">
                <h4 className="font-bold text-zinc-200 text-sm group-hover:text-violet-400 transition-colors">
                  {s.title}
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
