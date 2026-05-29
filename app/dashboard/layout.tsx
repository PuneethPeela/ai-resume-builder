"use client";

import { Header } from "@/components/shared/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-150 font-sans">
      <Header />
      <div className="flex-1 w-full bg-zinc-950">
        {children}
      </div>
    </div>
  );
}
