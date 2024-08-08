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
  baseUrl:
    typeof window === "undefined" ? env.BASE_URL : env.NEXT_PUBLIC_BASE_URL,
});

export default WorkspaceInvitationRoute;
