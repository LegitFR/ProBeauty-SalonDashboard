import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define protected routes (dashboard routes)
  const isProtectedRoute =
    path.startsWith("/home") ||
    path.startsWith("/bookings") ||
    path.startsWith("/services") ||
    path.startsWith("/products") ||
    path.startsWith("/ai-insights") ||
    path.startsWith("/staff") ||
    path.startsWith("/customers") ||
    path.startsWith("/finance") ||
    path.startsWith("/settings");

  // Check if user is authenticated by looking for token in cookies
  const token = request.cookies.get("accessToken")?.value;

  // Redirect to auth page if trying to access protected route without token
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  // Redirect to home if already logged in and trying to access auth page
  if (path === "/auth" && token) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
