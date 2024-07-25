import { object, string } from "zod";

export const getWorkspaceByIdInputSchema = object({
  workspaceId: string().min(1),
});
