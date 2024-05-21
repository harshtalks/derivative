import { EmptyRouteConfig } from "@/app/route.info";
import createRoute from "@/route.config";

const DashboardRoute = createRoute({
  name: "dashboard",
  fn: () => "/dashboard",
  paramsSchema: EmptyRouteConfig,
});

export default DashboardRoute;
