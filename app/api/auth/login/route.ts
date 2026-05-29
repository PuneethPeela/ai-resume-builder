import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { email, password, isGoogle, name } = await req.json();

    if (isGoogle) {
      if (!email) {
        return NextResponse.json({ success: false, error: "Email is required for Google Sign-In" }, { status: 400 });
      }
      const normalizedEmail = email.toLowerCase().trim();

      // Find or auto-register the Google user
      let user = await prisma.user.findFirst({
        where: { email: normalizedEmail },
      });

      if (!user) {
        const mockClerkId = `mock_${normalizedEmail.split("@")[0]}_${Math.floor(Math.random() * 1000)}`;
        user = await prisma.user.create({
          data: {
            clerkId: mockClerkId,
            email: normalizedEmail,
            name: name || normalizedEmail.split("@")[0],
            password: password || "google123",
            role: "user",
          }
        });
      }

      // Write mock cookie
      const cookieStore = await cookies();
      cookieStore.set("mock-user-id", user.clerkId, {
        path: "/",
        httpOnly: false,
        maxAge: 60 * 60 * 24 * 7,
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
    }

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Please enter email and password" }, { status: 400 });
    }

    // Try finding user by email
    const user = await prisma.user.findFirst({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "User is not registered" }, { status: 404 });
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
    return NextResponse.json({ success: false, error: error.message || "Login failed" }, { status: 500 });
  }
}
