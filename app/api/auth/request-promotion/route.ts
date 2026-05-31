import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth-helper";

export async function POST(req: NextRequest) {
  try {
    const { requestedRole } = await req.json();

    if (!requestedRole || (requestedRole !== "sub_admin" && requestedRole !== "user")) {
      return NextResponse.json({ success: false, error: "Invalid role request" }, { status: 400 });
    }

    const clerkUserId = await getSessionUser();
    
    // Find active user
    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUserId },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "Session user not found" }, { status: 404 });
    }

    if (requestedRole === "user") {
      // Demote instantly for tester convenience
      const updated = await prisma.user.update({
        where: { id: user.id },
        data: {
          role: "USER",
          promotionRequested: false,
          promotionRole: null,
        }
      });
      return NextResponse.json({ success: true, message: "Demoted to standard User successfully", data: updated });
    }

    // Set request in database for Admin approval
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        promotionRequested: true,
        promotionRole: requestedRole,
      }
    });

    return NextResponse.json({
      success: true,
      message: `Requested promotion to ${requestedRole === "sub_admin" ? "Sub-Admin" : "Admin"}. Pending Admin approval!`,
      data: updated
    });
  } catch (error: any) {
    console.error("Request Promotion API Error:", error);
    return NextResponse.json({ success: false, error: "Failed to submit promotion request" }, { status: 500 });
  }
}
