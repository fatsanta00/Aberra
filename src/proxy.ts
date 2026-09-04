import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Admin-only protection
    const token = req.nextauth.token;
    if (req.nextUrl.pathname.startsWith("/admin") && !token?.isAdmin) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/withdrawal/:path*", "/transfer/:path*", "/stake/:path*", "/admin/:path*"],
};
