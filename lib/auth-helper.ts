import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";

/**
 * Unified authentication helper.
 * If Clerk credentials are set, it queries Clerk auth().
 * If Clerk is bypassed, it falls back to checking a "mock-user-id" session cookie.
 * If no mock session is active, it defaults to the seeded candidate ID "mock_clerk_arjun_sharma",
 * ensuring 100% database query capability and preventing site crashes.
 */
export async function getSessionUser(): Promise<string> {
  let clerkUserId: string | null = null;

  // Protect against calling auth() when Clerk is unconfigured or bypassed
  if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    try {
      const authResult = await auth();
      clerkUserId = authResult.userId;
    } catch (err) {
      console.warn("Clerk auth() call bypassed due to missing middleware context:", err);
    }
  }

  // Fallback if Clerk ID is not active
  if (!clerkUserId) {
    try {
      const cookieStore = await cookies();
      const mockCookie = cookieStore.get("mock-user-id")?.value;
      clerkUserId = mockCookie || null;
    } catch {
      // Catch exceptions during static page rendering
    }
  }

  // Return empty string if no session is active to prevent unauthenticated access
  return clerkUserId || "";
}
