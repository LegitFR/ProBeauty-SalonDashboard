import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple JWT format validation (doesn't verify signature, just checks structure)
function isValidJWTFormat(token: string): boolean {
  if (!token) return false;

  const parts = token.split(".");
  // JWT should have 3 parts: header.payload.signature
  if (parts.length !== 3) return false;

  try {
    // Try to decode the payload to ensure it's valid base64
    const payload = JSON.parse(atob(parts[1]));

    // Check if token has expired (if exp field exists)
    if (payload.exp) {
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp < currentTime) {
        return false; // Token expired
      }
    }

    return true;
  } catch (e) {
    return false;
  }
}

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
    path.startsWith("/settings") ||
    path.startsWith("/orders");

  // Check if user is authenticated by looking for token in cookies
  const token = request.cookies.get("accessToken")?.value;

  // Redirect to auth page if trying to access protected route without valid token
  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }

    // Validate JWT format and expiration
    if (!isValidJWTFormat(token)) {
      // Clear invalid cookies
      const response = NextResponse.redirect(new URL("/auth", request.url));
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");
      return response;
    }
  }

  // Don't redirect from auth page - let users access it even if logged in
  // This allows them to login/logout or switch accounts
  // The auth page itself can handle redirecting if needed

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
