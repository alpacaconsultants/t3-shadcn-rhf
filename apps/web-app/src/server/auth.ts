import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { type NextAuthOptions, getServerSession } from 'next-auth';
import { type Adapter } from 'next-auth/adapters';
import GoogleProvider from 'next-auth/providers/google';
import { type JWT } from 'next-auth/jwt';
import { eq, type InferSelectModel } from 'drizzle-orm';
import { env } from '~/env';
import { db } from '~/server/db';
import { accounts, users } from '~/server/db/schema';

export type DbUser = InferSelectModel<typeof users>;

type UserRole = 'admin';

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    roles: UserRole[];
    isAdmin: boolean;
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
        token.id = user.id;

        // Fetch user roles
        const userWithRoles = await db.query.users.findFirst({
          where: (users, { eq }) => eq(users.id, user.id),
          with: {
            userRoles: {
              columns: {
                roleId: true,
              },
            },
          },
        });

        if (userWithRoles) {
          token.roles = userWithRoles.userRoles.map((ur) => ur.roleId) as UserRole[];
          token.isAdmin = token.roles.includes('admin');
        }
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
