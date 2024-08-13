/* eslint-disable @typescript-eslint/no-unused-vars */
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Custom logic here
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
