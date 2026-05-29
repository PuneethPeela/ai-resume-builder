import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, role } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ success: false, error: "Please fill in all fields" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { email: normalizedEmail },
          { clerkId: `mock_${normalizedEmail.split("@")[0]}` }
        ]
      }
    });

    if (existing) {
      return NextResponse.json({ success: false, error: "User already registered. Please sign in!" }, { status: 400 });
    }

    const mockClerkId = `mock_${normalizedEmail.split("@")[0]}_${Math.floor(Math.random() * 1000)}`;

    const user = await prisma.user.create({
      data: {
        clerkId: mockClerkId,
        email: normalizedEmail,
        name,
        password,
        role: role || "user", // support promoting during signup for tester convenience
      },
    });

    // Write mock cookie
    const cookieStore = await cookies();
    cookieStore.set("mock-user-id", mockClerkId, {
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
  } catch (error: any) {
    console.error("Register API Error:", error);
    return NextResponse.json({ success: false, error: "Registration failed" }, { status: 500 });
  }
}
