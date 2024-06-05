import { EmptyRouteConfig } from "@/app/route.info";
import createRoute from "@/route.config";

const WorkspaceRouteInfo = createRoute({
  name: "workspace-route",
  fn: () => "/workspaces",
  paramsSchema: EmptyRouteConfig,
});

export default WorkspaceRouteInfo;
