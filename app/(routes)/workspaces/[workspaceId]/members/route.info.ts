import createRoute from "@/route.config";
import { object, string } from "zod";

const WorkspaceMembersRouteInfo = createRoute({
  name: "workspace-members",
  fn: ({ workspaceId }) => `/workspaces/${workspaceId}/members`,
  paramsSchema: object({
    workspaceId: string(),
  }),
});

export default WorkspaceMembersRouteInfo;
