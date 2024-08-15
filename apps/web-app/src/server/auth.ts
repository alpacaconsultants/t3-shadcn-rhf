import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { type User, type NextAuthOptions, getServerSession } from 'next-auth';
import { type Adapter } from 'next-auth/adapters';
import GoogleProvider from 'next-auth/providers/google';
import { type JWT } from 'next-auth/jwt';
import { env } from '~/env';
import { db } from '~/server/db';
import { accounts, users } from '~/server/db/schema';

type UserId = string;

declare module 'next-auth/jwt' {
  interface JWT {
    id: UserId;
    roles: string[];
  }
}

declare module 'next-auth' {
  interface Session {
    user: User & {
      id: UserId;
      roles: string[];
    };
  }
}

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user, account }): Promise<JWT> {
      console.log('account!', account);
      // Initial sign in
      if (account && user) {
        token.id = user.id;
        token.roles = ['user']; // Default role

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
