import { relations, sql } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  blob,
  unique,
} from "drizzle-orm/sqlite-core";

// tables

export const memberRoles = [
  "admin",
  "support",
  "dev",
  "managerial",
  "qa",
  "hr",
  "finance",
  "marketing",
] as const;

export type Permission = "read" | "write" | "delete" | "admin";

export const workspaceTypes = ["personal", "enterprise", "standard"] as const;

export const workspaceStatus = ["active", "inactive", "archived"] as const;

export const createdAtSchema = integer("created_at").default(
  sql`(cast(unixepoch() as int))`
);

const updatedAtSchema = integer("updated_at").default(
  sql`(cast(unixepoch() as int))`
);

// TABLES

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
  details: text("details", { mode: "json" }).$type<{
    model?: string | undefined;
    type?: string | undefined;
    vendor?: string | undefined;
  }>(),
  ua: text("ua"),
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
});

// Business Logic Schema
export const members = sqliteTable(
  "members",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => `member_${crypto.randomUUID()}`),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    createdAt: createdAtSchema,
    updatedAt: updatedAtSchema,
    role: text("member_role", { enum: memberRoles }).notNull(),
    permissions: text("permissions", { mode: "json" }).$type<Permission[]>(),
    isCreator: integer("is_creator", { mode: "boolean" }).notNull(),
  },
  (table) => {
    return {
      uniqueMember: unique("unique_member").on(table.userId, table.workspaceId),
    };
  }
);

// workspaces -> what do you ideally need in the workspaces?
export const workspaces = sqliteTable("workspaces", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => `workspace_${crypto.randomUUID()}`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  createdAt: createdAtSchema,
  updatedAt: updatedAtSchema,
  createdBy: text("created_by")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
  status: text("status", {
    enum: workspaceStatus,
  }).notNull(),
  note: text("note"),
  tags: text("tags", { mode: "json" }).$type<string[]>(),
  workspaceType: text("workspace_type", {
    enum: workspaceTypes,
  }).notNull(),
});

// user relations
export const userRelations = relations(users, ({ many }) => ({
  authenticators: many(authenticators),
  sessions: many(sessions),
  members: many(members),
}));

// workspace relations
export const workspaceRelations = relations(workspaces, ({ many }) => ({
  members: many(members),
}));
