import { insertMarkupSchema } from "@/database/schema.zod";
import { object, string } from "zod";

export const addMarkupTemplateSchema = insertMarkupSchema.and(
  object({
    workspaceId: string().min(1),
  }),
);
