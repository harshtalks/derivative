import { number, object, string } from "zod";

export const templateListSchema = object({
  workspaceId: string(),
  page: number().default(1),
});
