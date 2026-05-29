import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth-helper";

export async function GET() {
  try {
    const clerkUserId = await getSessionUser();
    
    // Find active user in db
    let user = await prisma.user.findUnique({
      where: { clerkId: clerkUserId },
    });

    // If user doesn't exist, lazily provision
    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkId: clerkUserId,
          email: `${clerkUserId}@resumeai-mock.com`,
          name: clerkUserId.startsWith("mock_") 
            ? clerkUserId.replace("mock_", "").split("_")[0] 
            : "Reviewer Candidate",
          role: clerkUserId.includes("admin") ? "admin" : "user",
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        clerkId: user.clerkId,
        promotionRequested: user.promotionRequested,
        promotionRole: user.promotionRole,
      },
    });
  } catch (error: any) {
    console.error("Auth Me API Error:", error);
    return NextResponse.json({ success: true, data: { role: "user", email: "guest@resumeai.com", name: "Guest" } });
  }
}
