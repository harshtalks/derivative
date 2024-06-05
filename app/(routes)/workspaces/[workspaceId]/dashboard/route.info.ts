import { EmptyRouteConfig } from "@/app/route.info";
import createRoute from "@/route.config";
import { object, string } from "zod";

const DashboardRoute = createRoute({
  name: "dashboard",
  fn: ({ workspaceId }) => `/workspaces/${workspaceId}/dashboard`,
  paramsSchema: object({
    workspaceId: string(),
  }),
});

export default DashboardRoute;
