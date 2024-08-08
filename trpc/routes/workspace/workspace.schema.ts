import { number, object, string } from "zod";

export const getWorkspaceByIdInputSchema = object({
  workspaceId: string().min(1),
});

export const inviteFlowWorkspaceSchema = object({
  workspaceId: string().min(1),
  inviteFlowStep: number().min(0),
});
