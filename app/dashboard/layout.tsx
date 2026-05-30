"use client";

import { Header } from "@/components/shared/Header";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-150 font-sans relative overflow-hidden">
      {/* Sidebar for Desktop navigation */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-zinc-950">
        <Header />
        <main className="flex-1 w-full relative overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
