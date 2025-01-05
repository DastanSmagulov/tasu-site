import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Define the Role type
interface Role {
  key: string;
  value: string;
}

// Extend the token type to include our role
interface CustomToken {
  role: Role;
}

export async function middleware(req: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET;

  // Retrieve token with type
  const token = (await getToken({ req, secret })) as CustomToken | null;

  // Redirect to login if no token exists
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  const roleKey = "courier";
  // const roleKey = token.role?.key.toLowerCase();
  const pathname = req.nextUrl.pathname;

  if (pathname === "/unauthorized") {
    return NextResponse.next();
  }

  // Redirect from `/` to the user's role-based page
  if (pathname === "/") {
    if (roleKey) {
      const url = req.nextUrl.clone();
      url.pathname = `/${roleKey}`;
      return NextResponse.redirect(url);
    }
  }

  // Allow access only to routes matching the user's role
  const isRoleRoute = pathname.startsWith(`/${roleKey}`);
  if (!isRoleRoute) {
    const url = req.nextUrl.clone();
    url.pathname = "/unauthorized";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Config for route matching
export const config = {
  matcher: [
    "/",
    // "/admin/:path*",
    // "/manager/:path*",
    // "/courier/:path*",
    // "/forwarder/:path*",
    // "/transceiver/:path*",
    // "/accountant/:path*",
    "/unauthorized",
  ],
};
