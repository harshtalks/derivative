import { EmptyRouteConfig } from "@/app/route.info";
import createRoute from "@/route.config";

const SettingsRouteInfo = createRoute({
  fn: () => "/settings",
  name: "settings-route",
  paramsSchema: EmptyRouteConfig,
});

export default SettingsRouteInfo;
