import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { EMPTY_RESUME } from "@/types/resume";
import { getSessionUser } from "@/lib/auth-helper";

// Helper to get database User ID from Clerk ID, creating the user if missing
async function getOrCreateDbUser(clerkUserId: string) {
  const existingUser = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
  });

  if (existingUser) return existingUser;

  let email = `${clerkUserId}@noemail.com`;
  let name = clerkUserId.startsWith("mock_") 
    ? clerkUserId.replace("mock_", "").split("_")[0] 
    : "Reviewer Candidate";
  let imageUrl = null;

  try {
    const clerkUser = await currentUser();
    if (clerkUser) {
      email = clerkUser.emailAddresses[0]?.emailAddress || email;
      name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || name;
      imageUrl = clerkUser.imageUrl || null;
    }
  } catch {
    // Clerk is unconfigured
  }

  return await prisma.user.create({
    data: {
      clerkId: clerkUserId,
      email,
      name,
      imageUrl,
    },
  });
}

/**
 * GET /api/resumes
 * Lists all resumes belonging to the authenticated user.
 */
export async function GET() {
  try {
    const clerkUserId = await getSessionUser();
    if (!clerkUserId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await getOrCreateDbUser(clerkUserId);

    const resumes = await prisma.resume.findMany({
      where: { userId: dbUser.id },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ success: true, data: resumes });
  } catch (error: any) {
    console.error("GET /api/resumes error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to load resumes" }, { status: 500 });
  }
}

/**
 * POST /api/resumes
 * Creates a new blank resume or copies from an existing one.
 */
export async function POST(req: NextRequest) {
  try {
    const clerkUserId = await getSessionUser();
    if (!clerkUserId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await getOrCreateDbUser(clerkUserId);

    let title = "My Resume";
    let resumeData = EMPTY_RESUME;
    let template = "classic";

    try {
      const body = await req.json();
      if (body.title) title = body.title;
      if (body.data) resumeData = body.data;
      if (body.template) template = body.template;
    } catch {
      // Allow empty body to create blank default resume
    }

    const newResume = await prisma.resume.create({
      data: {
        userId: dbUser.id,
        title,
        data: resumeData as any,
        template,
        atsScore: 0,
      },
    });

    return NextResponse.json({ success: true, data: newResume });
  } catch (error: any) {
    console.error("POST /api/resumes error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to create resume" }, { status: 500 });
  }
}
