import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth-helper";

export async function GET() {
  try {
    const clerkUserId = await getSessionUser();
    
    if (!clerkUserId) {
      return NextResponse.json({ success: false, error: "Not Authenticated" }, { status: 401 });
    }
    
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
    
    // If PostgreSQL database is down, gracefully reconstruct active session details from active cookie to prevent guest demotions
    try {
      const clerkUserId = await getSessionUser();
      if (clerkUserId) {
        const cleanId = clerkUserId.replace("mock_", "");
        const mockEmail = cleanId.includes("@") ? cleanId : `${cleanId}@resumeai-mock.com`;
        
        let mockName = cleanId.split("_")[0];
        mockName = mockName.charAt(0).toUpperCase() + mockName.slice(1);
        
        return NextResponse.json({
          success: true,
          data: {
            id: "offline_fallback_user_id",
            email: mockEmail,
            name: mockName,
            role: clerkUserId.includes("admin") ? "admin" : "user",
            clerkId: clerkUserId,
            promotionRequested: false,
            promotionRole: null,
          },
        });
      }
    } catch (cookieErr) {
      console.error("Cookie parsing failed in me fallback:", cookieErr);
    }
    
    return NextResponse.json({ success: true, data: { role: "user", email: "guest@resumeai.com", name: "Guest" } });
  }
}
