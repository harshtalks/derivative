import { EmptyRouteConfig } from "@/app/route.info";
import createRoute from "@/route.config";

const V1Route = createRoute({
  name: "v1-route",
  fn: () => "/api/v1",
  paramsSchema: EmptyRouteConfig,
});

export default V1Route;
