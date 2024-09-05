// zod schemas for all the drizzle schema
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import {
  memberRoles,
  members,
  permissions,
  templateMarkups,
  templates,
  workspaceActivities,
  workspaces,
} from "./schema";
import { string, array, enum as _enum } from "zod";

// this is the schema for the workspaces table, pass this to the trpc query/mutation
export const insertWorkspaceSchema = createInsertSchema(workspaces, {
  // remove the tags field type here
  tags: string().array(),
});
export const selectWorkspaceSchema = createSelectSchema(workspaces, {
  // remove the tags field type here
  tags: string().array(),
});

export const selectMemberSchema = createSelectSchema(members);
export const insertMemberSchema = createInsertSchema(members, {
  permissions: array(_enum(permissions)).min(1),
  role: _enum(memberRoles),
});

export const activityLogSchema = createInsertSchema(workspaceActivities);

export const insertTemplateSchema = createInsertSchema(templates);

export const insertMarkupSchema = createInsertSchema(templateMarkups);
