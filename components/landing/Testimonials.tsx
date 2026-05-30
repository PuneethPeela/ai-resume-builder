"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TestimonialCard {
  text: string;
  name: string;
  role: string;
  ats: string;
  avatarInitials: string;
}

const TESTIMONIALS_DATA: TestimonialCard[] = [
  {
    text: "Clean interface, instant PDF, no paywall. This is the resume builder I've been looking for.",
    name: "Sneha Iyer",
    role: "PM @ Swiggy",
    ats: "ATS 96%",
    avatarInitials: "SI"
  },
  {
    text: "The Modern template with sidebar looks absolutely premium. My manager even commented on the layout.",
    name: "Dev Patel",
    role: "ML Engineer @ PhonePe",
    ats: "ATS 89%",
    avatarInitials: "DP"
  },
  {
    text: "From zero to a fully optimized resume in 25 minutes. The AI suggestions are scarily accurate.",
    name: "Meera Kapoor",
    role: "Backend Eng @ Zepto",
    ats: "ATS 92%",
    avatarInitials: "MK"
  },
  {
    text: "The multilingual copilot is insane — I described my projects in Telugu and got perfect English bullets.",
    name: "Rahul Nair",
    role: "Frontend Dev @ Razorpay",
    ats: "ATS 88%",
    avatarInitials: "RN"
  },
  {
    text: "The ATS auditor identified 8 missing keywords from the JD. My callback rate tripled after optimizing.",
    name: "Priya Sharma",
    role: "Data Engineer @ Flipkart",
    ats: "ATS 91%",
    avatarInitials: "PS"
  },
  {
    text: "ResumAI's XYZ bullet enhancer helped me rewrite my internship bullets. Got a Google offer within 3 weeks!",
    name: "Arjun Reddy",
    role: "SDE Intern @ Google",
    ats: "ATS 94%",
    avatarInitials: "AR"
  }
];

export function Testimonials() {
  // Duplicate array to achieve seamless infinite loop scrolling
  const listItems = [...TESTIMONIALS_DATA, ...TESTIMONIALS_DATA, ...TESTIMONIALS_DATA];

  return (
    <section className="py-20 md:py-24 bg-zinc-950/40 relative overflow-hidden font-sans border-t border-zinc-900/60">
      {/* Decorative backdrop glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-violet-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        
        {/* Section Headers */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="secondary" className="bg-violet-950/40 text-violet-400 border border-violet-900/40 text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full">
            Loved by Job Seekers
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Trusted by <span className="bg-gradient-to-r from-violet-400 via-violet-300 to-indigo-400 bg-clip-text text-transparent">10,000+</span> professionals
          </h2>
        </div>

        {/* Testimonials Infinite Marquee Carousel Container */}
        <div className="relative w-full overflow-hidden py-4 pause-on-hover select-none">
          {/* Edge shadow fades */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-zinc-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-zinc-950 to-transparent z-10 pointer-events-none" />

          {/* Scrolling tape wrapper */}
          <div className="animate-infinite-carousel gap-6 flex">
            {listItems.map((item, idx) => (
              <div
                key={idx}
                className="w-[280px] sm:w-[320px] shrink-0 p-5 rounded-2xl border border-zinc-900/80 bg-zinc-950/80 backdrop-blur-md flex flex-col justify-between gap-4 shadow-lg hover:border-violet-500/20 transition-colors duration-300"
              >
                <div className="space-y-2.5">
                  {/* Star Rating */}
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  {/* Testimonial Quote */}
                  <p className="text-zinc-350 text-[11px] sm:text-xs leading-relaxed font-sans font-medium italic">
                    "{item.text}"
                  </p>
                </div>

                {/* Profile card footer */}
                <div className="flex items-center justify-between border-t border-zinc-900/60 pt-3">
                  <div className="flex items-center gap-2.5">
                    {/* User Avatar */}
                    <div className="size-7.5 rounded-full bg-gradient-to-tr from-violet-600/80 to-indigo-650/80 flex items-center justify-center text-white font-bold text-[10px] shadow-sm uppercase shrink-0">
                      {item.avatarInitials}
                    </div>
                    {/* Name/Company */}
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-zinc-100 truncate leading-snug">{item.name}</p>
                      <p className="text-[10px] text-zinc-500 truncate leading-none mt-0.5">{item.role}</p>
                    </div>
                  </div>
                  {/* ATS Rating badge */}
                  <span className="text-[9px] bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 px-2 py-0.5 rounded-full shrink-0">
                    {item.ats}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
