import { type NextRequest, NextResponse } from 'next/server';
import { edgeGetServerAuthSession } from './server/util/server-utils';

// Workaround for NextAuth.js middleware
// https://github.com/nextauthjs/next-auth/issues/7732#issuecomment-1984335764
export async function middleware(request: NextRequest) {
  const session = await edgeGetServerAuthSession();

  // 🔥 check for relevant role/authorization (if necessarry)
  if (!session) {
    const signInUrl = new URL('/api/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
