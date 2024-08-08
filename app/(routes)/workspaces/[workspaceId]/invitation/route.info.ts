import { env } from "@/env";
import createRoute from "@/route.config";
import { object, string } from "zod";

const WorkspaceInvitationRoute = createRoute({
  name: "workspace-invitation",
  paramsSchema: object({
    workspaceId: string(),
  }),
  searchParamsSchema: object({
    invite: string().optional(),
  }),
  fn: ({ workspaceId }) => `/workspaces/${workspaceId}/invitation`,
});

export default WorkspaceInvitationRoute;
