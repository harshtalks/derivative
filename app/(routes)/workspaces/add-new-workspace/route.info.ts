import { EmptyRouteConfig } from "@/app/route.info";
import createRoute from "@/route.config";

const AddNewWorkspaceRoute = createRoute({
  name: "add-new-workspace",
  fn: () => "/workspaces/add-new-workspace",
  paramsSchema: EmptyRouteConfig,
});

export default AddNewWorkspaceRoute;
