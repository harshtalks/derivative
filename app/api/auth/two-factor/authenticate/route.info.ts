import { EmptyRouteConfig } from "@/app/route.info";
import createRoute from "@/route.config";
import { createEndPoint } from "tempeh";

const TFAuthenticate = createEndPoint({
  httpMethod: "GET",
  path: createRoute({
    paramsSchema: EmptyRouteConfig,
    fn: () => "/api/auth/two-factor/authenticate",
    name: "two-factor-authenticate",
  }),
  SafeResponse: false,
});

export default TFAuthenticate;
