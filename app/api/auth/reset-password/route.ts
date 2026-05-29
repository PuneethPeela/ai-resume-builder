import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth-helper";

export async function POST(req: NextRequest) {
  try {
    const { oldPassword, newPassword } = await req.json();

    if (!oldPassword || !newPassword) {
      return NextResponse.json({ success: false, error: "Please enter both old and new passwords" }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ success: false, error: "New password must be at least 6 characters long" }, { status: 400 });
    }

    if (oldPassword === newPassword) {
      return NextResponse.json({ success: false, error: "New password cannot be the same as the old password" }, { status: 400 });
    }

    const clerkUserId = await getSessionUser();
    
    // Find active user
    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUserId },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "Session user not found" }, { status: 404 });
    }

    // Verify old password (if they have one set, e.g. from local signup)
    if (user.password && user.password !== oldPassword) {
      return NextResponse.json({ success: false, error: "Incorrect old password entered" }, { status: 400 });
    }

    // Update password in db
    await prisma.user.update({
      where: { id: user.id },
      data: { password: newPassword },
    });

    return NextResponse.json({ success: true, message: "Password updated successfully" });
  } catch (error: any) {
    console.error("Reset Password API Error:", error);
    return NextResponse.json({ success: false, error: "Failed to reset password" }, { status: 500 });
  }
}
