"use client";

import { motion } from "framer-motion";
import { Brain, Target, Layout, FileDown } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: <Brain className="size-6 text-violet-400" />,
      title: "AI Summary Synthesis",
      desc: "Compile professional 3-sentence profile summaries perfectly optimized for ATS parsers and human recruiters.",
    },
    {
      icon: <Target className="size-6 text-violet-400" />,
      title: "ATS Auditor & Scorer",
      desc: "Audit your resume against any target job description. Verify matching keywords, highlight missing technical terms, and optimize scoring.",
    },
    {
      icon: <Layout className="size-6 text-violet-400" />,
      title: "Premium Typographic Templates",
      desc: "Swap between Classic serif layouts, Modern sidebars, or clean Minimal templates instantly. Fully customizable order structure.",
    },
    {
      icon: <FileDown className="size-6 text-violet-400" />,
      title: "Direct Client-Side PDF Exports",
      desc: "Export standard high-end vector PDF formats compiled straight in your browser in milliseconds. 100% offline support.",
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 150,
      },
    },
  } as const;

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-zinc-950 font-sans relative">
      {/* Back decorator */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-violet-900/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full space-y-12 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-100">
            Engineered for Job Application{" "}
            <span className="bg-gradient-to-r from-violet-400 to-indigo-500 bg-clip-text text-transparent">
              Success
            </span>
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Every feature is calibrated to help your resume clear corporate screening systems and catch recruiters' attention.
          </p>
        </div>

        {/* Feature Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6"
        >
          {features.map((f, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              className="group p-6 rounded-2xl border border-zinc-900 bg-zinc-950/20 hover:border-violet-500/30 hover:bg-violet-500/[0.02] flex flex-col gap-4 transition-all duration-300 shadow-md backdrop-blur-md"
            >
              <div className="size-12 rounded-xl bg-zinc-900 border border-zinc-800 group-hover:border-violet-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                {f.icon}
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-zinc-200 text-sm group-hover:text-violet-400 transition-colors">
                  {f.title}
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
