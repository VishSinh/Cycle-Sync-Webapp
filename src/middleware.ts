import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value || "";

  const isAuthPage = req.nextUrl.pathname.startsWith("/auth");
  const isOnboardingPage = req.nextUrl.pathname.startsWith("/onboarding");


  // If the user is on /auth and already logged in, redirect to home
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If the user is not logged in and is NOT on /auth, redirect to /auth
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  // Onboarding check - only for authenticated users and non-auth pages
  if (token && !isAuthPage) {
    const onboardingCompleted = req.cookies.get("onboarding_completed")?.value === "true";
    
    // If onboarding is not completed and user is not on onboarding page, redirect to onboarding
    if (!onboardingCompleted && !isOnboardingPage) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }
    
    // If onboarding is completed and user is on onboarding page, redirect to home
    if (onboardingCompleted && isOnboardingPage) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next(); // Allow the request to proceed
}

// Apply middleware to all routes EXCEPT static files, API routes, and Next.js internals
export const config = {
  matcher: ["/((?!_next|static|favicon.ico).*)"], // Protects everything except /auth and Next.js assets
};
