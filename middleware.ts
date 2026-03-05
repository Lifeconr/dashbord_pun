import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// List of routes that require authentication
const protectedRoutes = ["/dashboard", "/teams", "/users"];
// List of routes that should not be accessible when authenticated
const authRoutes = ["/login"];

export function middleware(request: NextRequest) {
    // In a real httpOnly cookie setup, we check for the presence of the session cookie.
    // However, Middleware in Next.js cannot access httpOnly cookies directly for logic
    // if they are truly httpOnly and not readable by the client-side JS (which middleware is part of server-side but usually checks for token existence).
    // For Sanctum, we often check for a 'laravel_session' or a custom 'is_logged_in' cookie.

    const token = request.cookies.get("token")?.value; // Or check your specific session cookie
    const { pathname } = request.nextUrl;

    const isProtectedRoute = pathname.startsWith("/dashboard") ||
        pathname.startsWith("/teams") ||
        pathname.startsWith("/users");

    const isAuthRoute = pathname === "/login" || pathname === "/register";

    // 1. Redirect to login if accessing protected route without token
    if (isProtectedRoute && !token) {
        const url = new URL("/login", request.url);
        url.searchParams.set("callbackUrl", pathname); // Optional: return user after login
        return NextResponse.redirect(url);
    }

    // 2. Redirect to dashboard if logged in and accessing auth routes
    if (isAuthRoute && token) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }


    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ["/dashboard/:path*", "/teams/:path*", "/users/:path*", "/login"],
};
