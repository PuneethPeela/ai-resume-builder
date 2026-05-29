import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/api/ai(.*)",
  "/api/resumes(.*)",
]);

/**
 * Custom wrapper middleware to handle missing Clerk environment keys gracefully.
 * If Clerk credentials are not configured in Vercel, it bypasses Clerk to prevent
 * site-wide 500 Middleware Invocation Failed errors, while preserving security headers.
 */
export default function middleware(req: NextRequest) {
  // If Clerk Publishable Key is missing, bypass auth protection to keep landing/mock pages accessible
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    console.warn(
      "WARNING: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not configured. Clerk auth bypass active to prevent 500 crash."
    );

    const response = NextResponse.next();
    
    // Inject standard security headers
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=()"
    );

    if (process.env.NODE_ENV === "production") {
      response.headers.set(
        "Strict-Transport-Security",
        "max-age=31536000; includeSubDomains"
      );
    }
    return response;
  }

  // Standard protected clerk middleware execution
  return clerkMiddleware(async (auth, req: NextRequest) => {
    if (isProtectedRoute(req)) {
      await auth.protect();
    }

    const response = NextResponse.next();

    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=()"
    );

    if (process.env.NODE_ENV === "production") {
      response.headers.set(
        "Strict-Transport-Security",
        "max-age=31536000; includeSubDomains"
      );
      response.headers.set(
        "Content-Security-Policy",
        "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://clerk.com https://*.clerk.accounts.dev; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://*.clerk.accounts.dev https://generativelanguage.googleapis.com https://*.supabase.co;"
      );
    }

    return response;
  })(req, {} as any);
}

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
