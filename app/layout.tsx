import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import { ChatAssistant } from "@/components/chat/ChatAssistant";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ResumAI — AI-Powered Resume Builder",
  description:
    "An intelligent resume builder that uses AI to analyze your job experience and craft professional, high-impact resumes tailored to specific job descriptions.",
  keywords: [
    "resume builder",
    "AI resume",
    "ATS optimization",
    "professional resume",
    "career",
  ],
  authors: [{ name: "Puneeth Peela" }],
  icons: {
    icon: "https://media.base44.com/images/public/6a19953ee856b5d3fd745e2e/ac15ab8bb_logo.png",
  },
  openGraph: {
    title: "ResumAI — AI-Powered Resume Builder",
    description:
      "An intelligent resume builder that uses AI to analyze your job experience and craft professional, high-impact resumes tailored to specific job descriptions.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={inter.variable} suppressHydrationWarning>
        <body className="min-h-screen bg-background font-sans antialiased">
          <Providers>
            {children}
            <ChatAssistant />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
