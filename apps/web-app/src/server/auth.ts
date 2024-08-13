import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { eq } from 'drizzle-orm';
import { getServerSession, type User, type NextAuthOptions } from 'next-auth';
import { type Adapter } from 'next-auth/adapters';
import GoogleProvider from 'next-auth/providers/google';

import { env } from '~/env';
import { db } from '~/server/db';
import { accounts, users, verificationTokens } from '~/server/db/schema';

type UserId = string;
/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth/jwt' {
  interface JWT {
    id: UserId;
  }
}

declare module 'next-auth' {
  interface Session {
    user: User & {
      id: UserId;
    };
  }
}
/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  // Changed to JWT strategy to avoid issues with NextAuth.js middleware
  // https://github.com/vercel/next.js/discussions/50177#discussioncomment-8207889
  // https://dev.to/miljancode/drizzle-orm-next-auth-and-planetscale-2jbl
  session: { strategy: 'jwt' },
  callbacks: {
    async session({ token, session }) {
      if (token && session) {
        session.user = {
          id: token.id,
          name: token.name,
          email: token.email,
          image: token.picture,
        };
      }

      return session;
    },
    async jwt({ token, user }) {
      if (!token.email) return token;
      const [dbUser] = await db.select().from(users).where(eq(users.email, token.email)).limit(1);

      if (!dbUser) {
        if (user) {
          token.id = user?.id;
        }
        return token;
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      };
    },
  },
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    verificationTokensTable: verificationTokens,
  }) as Adapter,
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
