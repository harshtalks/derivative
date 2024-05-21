import { relations, sql } from "drizzle-orm";
import { sqliteTable, text, integer, blob } from "drizzle-orm/sqlite-core";

// tables

/**
 * @description Users table
 */

export const createdAtSchema = integer("created_at").default(
  sql`(cast(unixepoch() as int))`
);

const updatedAtSchema = integer("updated_at").default(
  sql`(cast(unixepoch() as int))`
);

export const users = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => `user_${crypto.randomUUID()}`),
  username: text("username").notNull().unique(),
  githubId: text("github_id").notNull().unique(),
  createdAt: createdAtSchema,
  updatedAt: updatedAtSchema,
  avatar: text("avatar"),
  name: text("name").notNull(),
  email: text("email").notNull(),
  // 0 - disabled, 1 - enabled
  twoFactorEnabled: integer("two_factor_enabled", { mode: "boolean" })
    .notNull()
    .default(false),
});

/**
 * @description Sessions table
 */
export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey().notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: integer("expires_at").notNull(),
});

/**
 * @description authenticators table. Used for two-factor authentication using passkey authentication method (optional)
 */

export const authenticators = sqliteTable("authenticators", {
  id: text("cred_id").primaryKey(),
  userId: text("internal_user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  webAuthnUserId: text("webauthn_user_id").notNull().unique(),
  counter: integer("counter", { mode: "number" }).notNull(),
  backupEligible: integer("backup_eligible", { mode: "boolean" }).notNull(),
  backupStatus: integer("backup_status", { mode: "boolean" }).notNull(),
  credentialPublicKey: blob("cred_public_key").notNull(),
  // comma separated list of
  transports: text("transports").notNull(),
  // basic ones
  createdAt: createdAtSchema,
  updatedAt: updatedAtSchema,
  lastUsed: integer("updated_at").notNull(),
});

// relations
export const userRelations = relations(users, ({ many }) => ({
  authenticators: many(authenticators),
}));
