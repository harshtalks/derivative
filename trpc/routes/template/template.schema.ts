import { templateStatus } from "@/database/schema";
import { number, object, string, enum as enum_ } from "zod";

export const templateListSchema = object({
  workspaceId: string(),
  page: number().default(1),
  status: enum_(templateStatus).optional(),
});

export const deleteTemplateSchema = object({
  workspaceId: string().min(1),
  templateId: string().min(1),
});
