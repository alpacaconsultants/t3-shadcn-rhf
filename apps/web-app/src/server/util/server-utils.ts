import { type Session } from 'next-auth';
import { cookies } from 'next/headers';
import { env } from '~/env';

export const edgeGetServerAuthSession = async (): Promise<Session | null> => {
  const c = cookies();
  const allCookies = c
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');

  /**
   * If next-auth.session-token is not present, return 401
   * (!) IMPORTANT NOTE HERE:
   * next-auth likes to use different cookie name for prod (https) so make sure to set a consistent cookie name in your next-auth configuration file (see docs)
   */
  if (!c.get(env.NEXTAUTH_SESSION_TOKEN_COOKIE)?.value?.trim()) {
    return null;
  }

  const headers = {
    'Content-Type': 'application/json',
    Cookie: allCookies,
  };

  /**
   * Send a request to /api/auth/session to get the user session
   * process.LOOPBACK_URL can be set as localhost, or your website url
   */
  const url = new URL(`/api/auth/session`, process.env.NEXTAUTH_URL);
  const response = await fetch(url.href, {
    headers,
    cache: 'no-store',
  });

  if (response.ok) {
    const session = await response.json();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    if (new Date(session.expires) < new Date()) {
      return null;
    }

    return session as Session;
  }

  return null;
};
