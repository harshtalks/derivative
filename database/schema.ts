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

export const workspaceActivitiesEvents = [
  "created",
  "members_added",
  "members_removed",
] as const;

export type WorkspaceActivitiesEvents =
  (typeof workspaceActivitiesEvents)[number];

export type Permission = (typeof permissions)[number];

export const permissions = ["read", "write", "member_controls"] as const;

export const workspaceTypes = ["personal", "enterprise", "standard"] as const;

export const workspaceStatus = ["active", "inactive", "archived"] as const;

export const createdAtSchema = integer("created_at").default(Date.now());

const updatedAtSchema = integer("updated_at").default(Date.now());

export const templateStatus = ["draft", "active", "archived"] as const;

export const invoiceRemarkVisibility = ["public", "private"] as const;

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
  dob: integer("dob"),
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
    permissions: text("permissions", { mode: "json" })
      .$type<Permission[]>()
      .notNull(),
    isCreator: integer("is_creator", { mode: "boolean" }).notNull(),
  },
  (table) => {
    return {
      uniqueMember: unique("unique_member").on(table.userId, table.workspaceId),
    };
  },
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
      onDelete: "no action",
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

// workspace metadata
export const workspaceMetadata = sqliteTable("workspaceMetadata", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  inviteCode: text("invite_code"),
  inviteExpiry: integer("invite_expiry").notNull(),
  inviteLimit: integer("invite_limit").notNull(),
  inviteCount: integer("invite_count").notNull(),
});

// activities
// making a table to store all the activities to the workspace in this.
export const workspaceActivities = sqliteTable("workspaceActivities", {
  id: text("id"),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  performerId: text("performer_id")
    .notNull()
    .references(() => members.id, { onDelete: "no action" }),
  event: text("event", {
    enum: workspaceActivitiesEvents,
  }).notNull(),
  payload: text("payload", { mode: "json" }).notNull(),
  createdAt: createdAtSchema,
});

// templates
export const templates = sqliteTable(
  "invoiceTemplates",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => `template_${crypto.randomUUID()}`),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "set null" }),
    createdAt: createdAtSchema,
    updatedAt: updatedAtSchema,
    name: text("name").notNull(),
    createdBy: text("createdBy")
      .notNull()
      .references(() => members.id, { onDelete: "no action" }),
    jsonSchema: text("jsonSchema", { mode: "text" }).notNull(),
    json: text("json", { mode: "text" }).notNull(),
    description: text("description"),
    category: text("category").notNull(),
    subcategory: text("subcategory").notNull(),
    status: text("status", { enum: templateStatus }).notNull(),
  },
  // each workspace should have unique name for the template
  (table) => {
    return {
      uniqueMember: unique("unique_template_identifier").on(
        table.workspaceId,
        table.name,
      ),
    };
  },
);

export const templateIntegration = sqliteTable("templateIntegration", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => `integration_${crypto.randomUUID()}`),
  templateId: text("template_id")
    .notNull()
    .references(() => templates.id, { onDelete: "cascade" }),
  createdAt: createdAtSchema,
  updatedAt: updatedAtSchema,
  integrationKey: text("integration_key").notNull(),
});

export const templateMarkups = sqliteTable("templateMarkup", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => `markup_${crypto.randomUUID()}`),
  fontFamily: text("font").notNull(),
  templateId: text("template_id")
    .notNull()
    .references(() => templates.id, { onDelete: "cascade" }),
  createdAt: createdAtSchema,
  updatedAt: updatedAtSchema,
  markup: text("markup", { mode: "text" }).notNull(),
});

export const invoices = sqliteTable("invoices", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => `invoice_${crypto.randomUUID()}`),
  createdAt: createdAtSchema,
  updatedAt: updatedAtSchema,
  templateId: text("template_id")
    .notNull()
    .references(() => templates.id, { onDelete: "cascade" }),
});

export const invoiceRemarks = sqliteTable("invoiceRemarks", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => `remark_${crypto.randomUUID()}`),
  invoiceId: text("invoice_id")
    .notNull()
    .references(() => invoices.id, { onDelete: "cascade" }),
  // member id is the member who added the remark, but optional as it can be added by the user as well
  memberId: text("member_id").references(() => members.id, {
    onDelete: "no action",
  }),
  remark: text("remark").notNull(),
  type: text("type", { enum: ["internal", "external"] }).notNull(),
  visibility: text("visibility", { enum: invoiceRemarkVisibility }).notNull(),
  priority: integer("priority").default(0),
  createdAt: createdAtSchema,
  updatedAt: updatedAtSchema,
});

export const invoiceMetadata = sqliteTable("invoiceMetadata", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => `inv_metadata_${crypto.randomUUID()}`),
  invoiceId: text("invoice_id")
    .notNull()
    .references(() => invoices.id, { onDelete: "cascade" }),
  sentTo: text("sent_to").notNull(),
  lastUpdated: integer("last_updated").notNull(),
  cc: text("cc", { mode: "json" }).$type<string[]>(),
  bcc: text("bcc", { mode: "json" }).$type<string[]>(),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  openedAt: integer("opened_at"),
  createdAt: createdAtSchema,
  updatedAt: updatedAtSchema,
});

/**
 * Relations
 */

// user relations
export const userRelations = relations(users, ({ many }) => ({
  authenticators: many(authenticators),
  sessions: many(sessions),
  members: many(members),
}));

// Session relations
export const sessionRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

// authenticator relations
export const authenticatorRelations = relations(authenticators, ({ one }) => ({
  user: one(users, {
    fields: [authenticators.userId],
    references: [users.id],
  }),
}));

// workspace relations
export const workspaceRelations = relations(workspaces, ({ many, one }) => ({
  members: many(members, {
    relationName: "workspace_members",
  }),
  activities: many(workspaceActivities, {
    relationName: "workspace_activities",
  }),
  metadata: one(workspaceMetadata),
  creator: one(users, {
    fields: [workspaces.createdBy],
    references: [users.id],
  }),
}));

// metadata relationship
export const workspaceMetadataRelations = relations(
  workspaceMetadata,
  ({ one }) => ({
    workspace: one(workspaces, {
      fields: [workspaceMetadata.workspaceId],
      references: [workspaces.id],
    }),
  }),
);

// member relations
export const memberRelations = relations(members, ({ one, many }) => ({
  user: one(users, {
    fields: [members.userId],
    references: [users.id],
  }),
  workspace: one(workspaces, {
    fields: [members.workspaceId],
    references: [workspaces.id],
  }),
  invoice_remarks: many(invoiceRemarks),
}));

// template relations
export const templateRelations = relations(templates, ({ many, one }) => ({
  template_markup: one(templateMarkups),
  invoices: many(invoices),
  creator: one(members, {
    fields: [templates.createdBy],
    references: [members.id],
  }),
  templateIntegration: one(templateIntegration),
}));

export const templateIntegrationRelations = relations(
  templateIntegration,
  ({ one }) => ({
    template: one(templates, {
      fields: [templateIntegration.templateId],
      references: [templates.id],
    }),
  }),
);

export const templateMetadataRelations = relations(
  templateMarkups,
  ({ one }) => ({
    template: one(templates, {
      fields: [templateMarkups.templateId],
      references: [templates.id],
    }),
  }),
);

export const invoiceRelations = relations(invoices, ({ one, many }) => ({
  template: one(templates, {
    fields: [invoices.templateId],
    references: [templates.id],
  }),
  remarks: many(invoiceRemarks),
  metadata: one(invoiceMetadata),
}));

export const invoiceMetadataRelations = relations(
  invoiceMetadata,
  ({ one }) => ({
    invoice: one(invoices, {
      fields: [invoiceMetadata.invoiceId],
      references: [invoices.id],
    }),
  }),
);

export const invoiceRemarkRelations = relations(invoiceRemarks, ({ one }) => ({
  invoice: one(invoices, {
    fields: [invoiceRemarks.invoiceId],
    references: [invoices.id],
  }),
  member: one(members, {
    fields: [invoiceRemarks.memberId],
    references: [members.id],
  }),
}));

export const workspaceActivityRelations = relations(
  workspaceActivities,
  ({ one }) => ({
    workspace: one(workspaces, {
      fields: [workspaceActivities.workspaceId],
      references: [workspaces.id],
    }),
    performedBy: one(members, {
      fields: [workspaceActivities.performerId],
      references: [members.id],
    }),
  }),
);
