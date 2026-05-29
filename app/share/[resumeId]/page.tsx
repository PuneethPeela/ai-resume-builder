import { prisma } from "@/lib/prisma";
import { SharePageClient } from "@/components/share/SharePageClient";
import type { ResumeFormData, TemplateName } from "@/types/resume";
import { Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface SharePageProps {
  params: Promise<{
    resumeId: string;
  }>;
}

export default async function SharePage({ params }: SharePageProps) {
  const { resumeId } = await params;

  // Fetch the resume from the database
  let resume = null;
  try {
    resume = await prisma.resume.findUnique({
      where: { id: resumeId },
    });
  } catch (err) {
    console.error("Error fetching shared resume:", err);
  }

  // Check if resume exists and is public
  if (!resume || !resume.isPublic) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 text-zinc-100 font-sans">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.05),transparent_60%)] pointer-events-none" />
        
        <div className="relative max-w-md w-full bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-6 md:p-8 text-center shadow-2xl space-y-6">
          <div className="mx-auto size-16 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 relative">
            <Lock className="size-7" />
            <div className="absolute inset-0 rounded-full border border-violet-500/20 animate-ping opacity-30" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-bold tracking-tight text-zinc-100">Private Portfolio</h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              This resume is currently private or does not exist. If you are the owner, please log in to the ResumeAI dashboard and toggle "Public Visibility" in the editor header to share it.
            </p>
          </div>

          <div className="pt-2">
            <Link href="/" passHref>
              <Button className="w-full bg-violet-600 hover:bg-violet-500 text-white font-medium gap-2">
                <ArrowLeft className="size-4" />
                <span>Return to Home</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Parse the data field which is JSON
  const resumeData = resume.data as unknown as ResumeFormData;
  const template = resume.template as TemplateName;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-violet-600/30">
      <SharePageClient
        resumeData={resumeData}
        template={template}
        resumeId={resumeId}
      />
    </div>
  );
}
