import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { type NextAuthOptions, type User, getServerSession } from "next-auth";
import { type Adapter } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import { type JWT } from "next-auth/jwt";
import { type InferSelectModel } from "drizzle-orm";
import { env } from "~/env";
import { db } from "~/server/db";
import { accounts, users } from "~/server/db/schema";

export type DbUser = InferSelectModel<typeof users>;

type UserRole = "admin";

interface CustomUserData {
  id: string;
  roles: UserRole[];
  isAdmin: boolean;
}

declare module "next-auth/jwt" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface JWT extends CustomUserData {}
}

declare module "next-auth" {
  interface Session {
    user: User & CustomUserData;
  }
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
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
          token.roles = userWithRoles.userRoles.map(
            (ur) => ur.roleId,
          ) as UserRole[];
          token.isAdmin = token.roles.includes("admin");
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
        isAdmin: token.isAdmin,
      },
    }),
    async redirect({ url, baseUrl }) {
      // If no specific redirect URL is provided, go to the base URL (home page)
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
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
