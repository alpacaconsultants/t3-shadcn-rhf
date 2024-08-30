import { type Route } from 'next';
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

const allowedPaths: Route[] = ['/', '/survey/[slug]' as Route];

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

        // console.log('path!', path); // is survey/1234
        // console.log('dyanmic!', '???'); //  I want /survey/[slug]

        // Allow access to paths starting with allowedPaths without authentication
        if (allowedPaths.some((allowedPath) => path === allowedPath)) {
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
