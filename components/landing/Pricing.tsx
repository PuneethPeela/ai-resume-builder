"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface PricingTier {
  name: string;
  price: string;
  desc: string;
  features: string[];
  cta: string;
  href: string;
  popular?: boolean;
}

const PRICING_TIERS: PricingTier[] = [
  {
    name: "Starter",
    price: "Free",
    desc: "Perfect for trying out ResumAI.",
    features: [
      "3 Saved Resumes",
      "Classic Serif Template",
      "Direct Client-Side PDF Exports",
      "Basic AI Assistance (5/mo)"
    ],
    cta: "Get Started",
    href: "/sign-up"
  },
  {
    name: "Pro",
    price: "$9",
    desc: "For active job seekers.",
    features: [
      "Unlimited Resumes & Layouts",
      "All 3 Premium Typographic Templates",
      "Unlimited XYZ Bullet Enhancer",
      "ATS Auditor & Compatibility Scoring",
      "Bilingual AI Copilot Assistant",
      "AI Tailored Interview Prep Coach"
    ],
    cta: "Start Free Trial",
    href: "/sign-up",
    popular: true
  },
  {
    name: "Team",
    price: "$29",
    desc: "For career coaches & teams.",
    features: [
      "Everything included in Pro tier",
      "Up to 10 active Team members",
      "Administrative Registry Dashboard",
      "Priority Live Support",
      "Enterprise security compliance SLA"
    ],
    cta: "Contact Sales",
    href: "mailto:sales@resumeai.com"
  }
];

export function Pricing() {
  return (
    <section className="py-20 md:py-24 bg-zinc-950 font-sans relative border-t border-zinc-900/60">
      {/* Decorative backdrop glow */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-violet-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Section Headers */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="secondary" className="bg-violet-950/40 text-violet-400 border border-violet-900/40 text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full">
            Pricing
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Simple, transparent <span className="bg-gradient-to-r from-violet-400 via-violet-300 to-indigo-400 bg-clip-text text-transparent">pricing</span>
          </h2>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto pt-4">
          {PRICING_TIERS.map((tier, idx) => (
            <Card
              key={idx}
              className={`glass flex flex-col justify-between border-zinc-850 shadow-2xl relative overflow-hidden transition-all duration-300 ${
                tier.popular 
                  ? "border-violet-600/50 shadow-violet-950/15 scale-100 md:scale-[1.03] z-10" 
                  : "hover:border-zinc-800"
              }`}
            >
              {/* Top accent line */}
              {tier.popular && (
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-violet-600 to-indigo-650" />
              )}

              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-violet-600 to-indigo-650 text-white border-0 text-[9px] uppercase font-extrabold px-3.5 py-1 rounded-b-xl tracking-wider shadow-sm">
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="p-6 pb-4 space-y-2 mt-2">
                <CardTitle className="text-lg font-bold text-zinc-100">{tier.name}</CardTitle>
                <CardDescription className="text-xs text-zinc-400 font-medium">{tier.desc}</CardDescription>
              </CardHeader>

              <CardContent className="px-6 pb-6 space-y-6 flex-1 flex flex-col justify-between">
                
                {/* Pricing Block */}
                <div className="space-y-4">
                  <div className="flex items-baseline gap-1 pt-2">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{tier.price}</span>
                    {tier.price !== "Free" && (
                      <span className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">/mo</span>
                    )}
                  </div>

                  {/* Feature checklist */}
                  <ul className="space-y-2.5 text-xs text-zinc-300">
                    {tier.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5">
                        <Check className="size-4 text-violet-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Action Button */}
                <div className="pt-6">
                  {tier.price === "Contact Sales" ? (
                    <a href={tier.href}>
                      <Button className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-semibold rounded-lg py-2.5 shadow-md cursor-pointer">
                        {tier.cta}
                      </Button>
                    </a>
                  ) : (
                    <Link href={tier.href} passHref>
                      <Button className={`w-full text-xs font-semibold rounded-lg py-2.5 shadow-md cursor-pointer ${
                        tier.popular 
                          ? "bg-gradient-to-r from-violet-600 to-indigo-650 hover:from-violet-550 hover:to-indigo-550 text-white shadow-violet-950/20" 
                          : "bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200"
                      }`}>
                        {tier.cta}
                      </Button>
                    </Link>
                  )}
                </div>

              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
}
