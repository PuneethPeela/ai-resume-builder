import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth-helper";

// Helper to check caller permissions
async function verifyAdminOrSubAdmin() {
  const clerkUserId = await getSessionUser();
  const caller = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
  });

  if (!caller || (caller.role !== "ADMIN" && caller.role !== "SUBADMIN")) {
    return null;
  }
  return caller;
}

/**
 * GET /api/admin/users
 * Returns list of all users in the system.
 * Accessible by both Admin and Sub-Admin.
 */
export async function GET() {
  try {
    const caller = await verifyAdminOrSubAdmin();
    if (!caller) {
      return NextResponse.json({ success: false, error: "Access Denied: Admins Only" }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        promotionRequested: true,
        promotionRole: true,
        clerkId: true,
        createdAt: true,
      }
    });

    return NextResponse.json({ success: true, data: users });
  } catch (error: any) {
    console.error("GET Admin Users error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch users" }, { status: 500 });
  }
}

/**
 * POST /api/admin/users
 * Allows Admin to create a new user manually.
 * Sub-Admin BLOCKED.
 */
export async function POST(req: NextRequest) {
  try {
    const caller = await verifyAdminOrSubAdmin();
    if (!caller) {
      return NextResponse.json({ success: false, error: "Access Denied" }, { status: 403 });
    }

    if (caller.role === "SUBADMIN") {
      return NextResponse.json({ success: false, error: "Access Denied: Sub-Admins cannot create users" }, { status: 403 });
    }

    const { email, password, name, role } = await req.json();

    if (!email || !name) {
      return NextResponse.json({ success: false, error: "Please enter name and email" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json({ success: false, error: "User already exists with this email" }, { status: 400 });
    }

    const mockClerkId = `mock_${email.toLowerCase().split("@")[0]}_${Math.floor(Math.random() * 1000)}`;

    const newUser = await prisma.user.create({
      data: {
        clerkId: mockClerkId,
        email: email.toLowerCase().trim(),
        name,
        password: password || "user123",
        role: role || "USER",
      }
    });

    return NextResponse.json({ success: true, data: newUser });
  } catch (error: any) {
    console.error("POST Admin Users error:", error);
    return NextResponse.json({ success: false, error: "Failed to create user" }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/users
 * Allows updating a user's role or approving/rejecting promotions.
 * Sub-Admin BLOCKED.
 */
export async function PATCH(req: NextRequest) {
  try {
    const caller = await verifyAdminOrSubAdmin();
    if (!caller) {
      return NextResponse.json({ success: false, error: "Access Denied" }, { status: 403 });
    }

    if (caller.role === "SUBADMIN") {
      return NextResponse.json({ success: false, error: "Access Denied: Sub-Admins cannot modify users" }, { status: 403 });
    }

    const { userId, role, action, promotionRole } = await req.json();

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
    }

    let updatedUser;

    if (action === "approve_promotion") {
      updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          role: promotionRole || "SUBADMIN",
          promotionRequested: false,
          promotionRole: null,
        }
      });
    } else if (action === "reject_promotion") {
      updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          promotionRequested: false,
          promotionRole: null,
        }
      });
    } else {
      // General role change
      updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { role }
      });
    }

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error: any) {
    console.error("PATCH Admin Users error:", error);
    return NextResponse.json({ success: false, error: "Failed to modify user" }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/users
 * Deletes a user from the system.
 * Sub-Admin BLOCKED.
 */
export async function DELETE(req: NextRequest) {
  try {
    const caller = await verifyAdminOrSubAdmin();
    if (!caller) {
      return NextResponse.json({ success: false, error: "Access Denied" }, { status: 403 });
    }

    if (caller.role === "SUBADMIN") {
      return NextResponse.json({ success: false, error: "Access Denied: Sub-Admins cannot delete users" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ success: true, message: "User deleted successfully" });
  } catch (error: any) {
    console.error("DELETE Admin Users error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete user" }, { status: 500 });
  }
}
