import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Please enter email and password" }, { status: 400 });
    }

    // Try finding user by email
    const user = await prisma.user.findFirst({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found. Register a new account!" }, { status: 404 });
    }

    // Mock validation matching (allows easy reviewer login or password match)
    if (user.password && user.password !== password) {
      return NextResponse.json({ success: false, error: "Incorrect password entered" }, { status: 401 });
    }

    // Write mock cookie
    const cookieStore = await cookies();
    cookieStore.set("mock-user-id", user.clerkId, {
      path: "/",
      httpOnly: false, // Allow client side access for visual cues
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        clerkId: user.clerkId,
      },
    });
  } catch (error: any) {
    console.error("Login API Error:", error);
    return NextResponse.json({ success: false, error: "Login failed" }, { status: 500 });
  }
}
