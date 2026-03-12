import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// List of routes that require authentication
const protectedRoutes = ["/admin", "/admin/dashboard", "/admin/teams", "/admin/users", "/admin/attendance"];
// List of routes that should not be accessible when authenticated
const authRoutes = ["/login"];

export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    const { pathname } = request.nextUrl;

    const isProtectedRoute = pathname.startsWith("/admin");
    const isAuthRoute = pathname === "/login" || pathname === "/register";

    // 1. Legacy redirect for /dashboard to /admin/dashboard
    if (pathname === "/dashboard" || pathname === "/dashboard/overview") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    // 2. Redirect to login if accessing protected route without token
    if (isProtectedRoute && !token) {
        const url = new URL("/login", request.url);
        url.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(url);
    }

    // 3. Redirect to admin dashboard if logged in and accessing auth routes
    if (isAuthRoute && token) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/dashboard/:path*", "/login"],
};
