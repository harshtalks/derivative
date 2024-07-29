import createRoute from "@/route.config";
import { object, string } from "zod";

const WorkspaceSettingsRouteInfo = createRoute({
  name: "workspace-settings",
  fn: ({ workspaceId }) => `/workspaces/${workspaceId}/settings`,
  paramsSchema: object({
    workspaceId: string(),
  }),
});

export default WorkspaceSettingsRouteInfo;
