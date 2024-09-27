import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  jsonb,
  pgTableCreator,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";
import { generateSlug } from "../util/server-utils";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `strixy_${name}`);

export const posts = createTable(
  "post",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    createdById: varchar("created_by", { length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (example) => ({
    createdByIdIdx: index("created_by_idx").on(example.createdById),
    nameIndex: index("name_idx").on(example.name),
  }),
);

export const surveys = createTable(
  "survey",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    context: text("context"),
    status: varchar("status", {
      enum: ["ENRICHING", "ENRICHED"],
      length: 255,
    }).notNull(),
    createdById: varchar("created_by", { length: 255 })
      .notNull()
      .references(() => users.id),
    s3Key: varchar("s3_key", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
    slug: varchar("slug", { length: 64 }).$defaultFn(() => generateSlug(22)),
  },
  (example) => ({
    createdByIdIdx: index("survey_created_by_idx").on(example.createdById),
    nameIndex: index("survey_name_idx").on(example.name),
    slugIndex: index("survey_slug_idx").on(example.slug),
  }),
);

export const surveysRelations = relations(surveys, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [surveys.createdById],
    references: [users.id],
  }),
  insights: many(insights),
}));

export const insights = createTable(
  "insights",
  {
    id: serial("id").primaryKey(),
    surveyId: integer("survey_id")
      .notNull()
      .references(() => surveys.id),
    reference: integer("reference"),
    topic: varchar("topic", { length: 1000 }),
    sentiment: varchar("sentiment", {
      enum: ["positive", "negative", "neutral"],
    }),
    originalData: jsonb("original_data").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (example) => ({
    surveyIdIdx: index("insights_suvey_idx").on(example.surveyId),
  }),
);

export const insightsRelations = relations(insights, ({ one }) => ({
  survey: one(surveys, {
    fields: [insights.surveyId],
    references: [surveys.id],
  }),
}));

export const users = createTable("user", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("email_verified", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
});

export const roles = createTable("role", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { enum: ["admin", "user"], length: 255 }).notNull(),
});

export const userRoles = createTable(
  "user_role",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    roleId: varchar("role_id", { length: 255 })
      .notNull()
      .references(() => roles.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.roleId] }),
  }),
);

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  userRoles: many(userRoles),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  userRoles: many(userRoles),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.id],
  }),
  role: one(roles, {
    fields: [userRoles.roleId],
    references: [roles.id],
  }),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_user_id_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

// export const sessions = createTable(
//   'session',
//   {
//     sessionToken: varchar('session_token', { length: 255 }).notNull().primaryKey(),
//     userId: varchar('user_id', { length: 255 })
//       .notNull()
//       .references(() => users.id),
//     expires: timestamp('expires', {
//       mode: 'date',
//       withTimezone: true,
//     }).notNull(),
//   },
//   (session) => ({
//     userIdIdx: index('session_user_id_idx').on(session.userId),
//   })
// );

// export const sessionsRelations = relations(sessions, ({ one }) => ({
//   user: one(users, { fields: [sessions.userId], references: [users.id] }),
// }));

// export const verificationTokens = createTable(
//   'verification_token',
//   {
//     identifier: varchar('identifier', { length: 255 }).notNull(),
//     token: varchar('token', { length: 255 }).notNull(),
//     expires: timestamp('expires', {
//       mode: 'date',
//       withTimezone: true,
//     }).notNull(),
//   },
//   (vt) => ({
//     compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
//   })
// );
