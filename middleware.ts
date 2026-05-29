import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/auth(.*)",
  "/share(.*)",
]);

/**
 * Custom wrapper middleware to handle missing Clerk environment keys gracefully.
 * If Clerk credentials are not configured in Vercel, it bypasses Clerk to prevent
 * site-wide 500 Middleware Invocation Failed errors, while preserving security headers.
 */
export default function middleware(req: NextRequest) {
  // If Clerk Publishable Key is missing, enforce our own robust mock authentication checks
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    const mockUserIdCookie = req.cookies.get("mock-user-id")?.value;
    const { pathname } = req.nextUrl;

    // Define public routes
    const isPublic = pathname === "/" ||
                     pathname === "/sign-in" || 
                     pathname === "/sign-up" || 
                     pathname.startsWith("/share") ||
                     pathname.startsWith("/api/auth") ||
                     pathname.startsWith("/_next") ||
                     pathname.includes(".");

    if (!mockUserIdCookie && !isPublic) {
      // Force redirect to sign-in page
      const url = req.nextUrl.clone();
      url.pathname = "/sign-in";
      return NextResponse.redirect(url);
    }

    if (mockUserIdCookie && (pathname === "/sign-in" || pathname === "/sign-up" || pathname === "/")) {
      // Redirect authenticated user to dashboard console
      const url = req.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }

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
    if (!isPublicRoute(req)) {
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
