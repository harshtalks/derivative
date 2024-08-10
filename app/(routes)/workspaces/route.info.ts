import { EmptyRouteConfig } from "@/app/route.info";
import serverContext from "@/lib/sever/context";
import createRoute from "@/route.config";
import Branded from "@/types/branded.type";

const WorkspaceRouteInfo = createRoute({
  name: "workspace-route",
  fn: () => "/workspaces",
  paramsSchema: EmptyRouteConfig,
});

const [currentWorkspace, setCurrentWorkspace] = serverContext("");

const brandedCurrentWorkspace = () => {
  return Branded.WorkspaceId(currentWorkspace());
};

export { brandedCurrentWorkspace, setCurrentWorkspace };

export default WorkspaceRouteInfo;
