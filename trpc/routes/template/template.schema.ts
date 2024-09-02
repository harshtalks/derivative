import { number, object, string } from "zod";

export const templateListSchema = object({
  workspaceId: string(),
  page: number().default(1),
});

export const deleteTemplateSchema = object({
  workspaceId: string().min(1),
  templateId: string().min(1),
});
