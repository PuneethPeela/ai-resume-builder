import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

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

// Helper to authenticate request and verify resume ownership
async function verifyResumeOwnership(resumeId: string, clerkUserId: string) {
  try {
    const dbUser = await getOrCreateDbUser(clerkUserId);

    const resume = await prisma.resume.findUnique({
      where: { id: resumeId },
    });

    if (!resume || resume.userId !== dbUser.id) {
      return null;
    }

    return { dbUser, resume };
  } catch (error) {
    console.error("verifyResumeOwnership user sync error:", error);
    return null;
  }
}

/**
 * GET /api/resumes/[id]
 * Fetches a single resume by its ID, validating ownership.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const ownership = await verifyResumeOwnership(id, clerkUserId);
    if (!ownership) {
      return NextResponse.json({ success: false, error: "Resume not found or access denied" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: ownership.resume });
  } catch (error: any) {
    console.error("GET /api/resumes/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to load resume" }, { status: 500 });
  }
}

/**
 * PUT /api/resumes/[id]
 * Updates title, data, template, or atsScore on a specific resume.
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const ownership = await verifyResumeOwnership(id, clerkUserId);
    if (!ownership) {
      return NextResponse.json({ success: false, error: "Resume not found or access denied" }, { status: 404 });
    }

    const body = await req.json();
    const updateData: any = {};

    if (body.title !== undefined) updateData.title = body.title;
    if (body.data !== undefined) updateData.data = body.data;
    if (body.template !== undefined) updateData.template = body.template;
    if (body.atsScore !== undefined) updateData.atsScore = body.atsScore;
    if (body.isPublic !== undefined) updateData.isPublic = body.isPublic;

    const updatedResume = await prisma.resume.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: updatedResume });
  } catch (error: any) {
    console.error("PUT /api/resumes/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to update resume" }, { status: 500 });
  }
}

/**
 * DELETE /api/resumes/[id]
 * Deletes a single resume.
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const ownership = await verifyResumeOwnership(id, clerkUserId);
    if (!ownership) {
      return NextResponse.json({ success: false, error: "Resume not found or access denied" }, { status: 404 });
    }

    await prisma.resume.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Resume deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /api/resumes/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete resume" }, { status: 500 });
  }
}
