import { type Route } from 'next';
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

const allowedPaths: Route[] = ['/'];

export default withAuth(
  function middleware() {
    // Custom logic here
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        if (path.startsWith('/admin') && !token?.isAdmin) return false;

        // Allow access to paths starting with allowedPaths without authentication
        if (allowedPaths.some((allowedPath) => path === allowedPath)) {
          return true;
        }
        // For other paths, require authentication
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
