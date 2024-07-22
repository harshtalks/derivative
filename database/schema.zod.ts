// zod schemas for all the drizzle schema
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { workspaces } from "./schema";
import { string } from "zod";

// this is the schema for the workspaces table, pass this to the trpc query/mutation
export const insertWorkspaceSchema = createInsertSchema(workspaces, {
  // remove the tags field type here
  tags: string().array(),
});
