import { EmptyRouteConfig } from "@/app/route.info";
import createRoute from "@/route.config";
import { createEndPoint } from "tempeh";

const TFRegistration = createEndPoint({
  httpMethod: "GET",
  SafeResponse: false,
  path: createRoute({
    name: "two-factor-auth-reg",
    fn: () => "/api/auth/two-factor/registration",
    paramsSchema: EmptyRouteConfig,
  }),
});

export default TFRegistration;
