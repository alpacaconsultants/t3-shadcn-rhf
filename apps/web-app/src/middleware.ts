import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { pathToRegexp } from 'path-to-regexp';

// ToDo: not sure why I cannot use Route here
type MiddleWareRoute = __next_route_internal_types__.StaticRoutes | __next_route_internal_types__.DynamicRoutes;

const allowedPaths: MiddleWareRoute[] = ['/', '/survey/:slug'];

// Define allowed paths and precompile regex matchers
const regexMatchers = allowedPaths.map((route) => pathToRegexp(route));

// Helper function to check if a path matches any allowed route
const isAllowedPath = (path: string) => regexMatchers.some((regex) => regex.test(path));

const webhooksPath = '/api/web-hooks';

export default withAuth(
  function middleware(req) {
    if (req.nextauth.token?.isAdmin) return NextResponse.next();

    const path = req.nextUrl.pathname;

    // Protect all /api/web-hooks
    if (path.startsWith(webhooksPath)) {
      const apiKey = req.headers.get('api_key');
      if (apiKey !== process.env.WEBHOOK_API_KEY) {
        return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        // Allow access to paths starting with allowedPaths without authentication
        if (isAllowedPath(path)) {
          return true;
        }

        // Protect admin routes
        if (path.startsWith('/admin') && !token?.isAdmin) return false;

        // Handle in next middleware
        if (path.startsWith(webhooksPath)) return true;

        // For other paths, require authentication
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)', '/api/web-hooks/:path*'],
};
