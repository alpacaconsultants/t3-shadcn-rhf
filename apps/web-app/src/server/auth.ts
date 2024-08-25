import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { type NextAuthOptions, getServerSession } from 'next-auth';
import { type Adapter } from 'next-auth/adapters';
import GoogleProvider from 'next-auth/providers/google';
import { type JWT } from 'next-auth/jwt';
import { type InferSelectModel } from 'drizzle-orm';
import { env } from '~/env';
import { db } from '~/server/db';
import { accounts, users } from '~/server/db/schema';

export type DbUser = InferSelectModel<typeof users>;

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    roles: DbUser['roles'];
  }
}

declare module 'next-auth' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface User extends DbUser {}

  interface Session {
    user: DbUser;
  }
}

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user, account }): Promise<JWT> {
      // Initial sign in
      if (account && user) {
        console.log('sign in token! before', token);

        token.id = user.id;
        token.roles = user.roles;

        console.log('sign in token!', token);

        // Fetch user roles from database
        // const dbUser = await db.select({ roles: users.roles })
        //                         .from(users)
        //                         .where(eq(users.id, user.id))
        //                         .limit(1);

        // if (dbUser && dbUser[0]) {
        //   token.roles = dbUser[0].roles || ['user'];
        // }

        return token;
      }

      console.log('next token!', token);
      // Subsequent uses of the token
      return token;
    },
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.id,
        roles: token.roles,
      },
    }),
  },
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
  }) as Adapter,
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
};

export const getServerAuthSession = () => getServerSession(authOptions);
