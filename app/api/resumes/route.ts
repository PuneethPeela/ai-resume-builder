import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { EMPTY_RESUME } from "@/types/resume";

// Helper to get database User ID from Clerk ID, creating the user if missing
async function getOrCreateDbUser(clerkUserId: string) {
  const existingUser = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
  });

  if (existingUser) return existingUser;

  // Retrieve full details from Clerk API to populate db
  const clerkUser = await currentUser();
  if (!clerkUser) {
    throw new Error("Unable to fetch user details from Clerk");
  }

  const email = clerkUser.emailAddresses[0]?.emailAddress || `${clerkUserId}@noemail.com`;
  const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || null;
  const imageUrl = clerkUser.imageUrl || null;

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
    const { userId: clerkUserId } = await auth();
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
    const { userId: clerkUserId } = await auth();
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
