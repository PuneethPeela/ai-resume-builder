import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ResumeAI — AI-Powered Resume Builder",
  description:
    "Create professional, ATS-optimized resumes with AI-powered suggestions, real-time preview, and multilingual support. Build your perfect resume in minutes.",
  keywords: [
    "resume builder",
    "AI resume",
    "ATS optimization",
    "professional resume",
    "career",
  ],
  authors: [{ name: "Puneeth Peela" }],
  openGraph: {
    title: "ResumeAI — AI-Powered Resume Builder",
    description:
      "Create professional, ATS-optimized resumes with AI-powered suggestions.",
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
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
