import { EmptyRouteConfig } from "@/app/route.info";
import createRoute from "@/route.config";
import { createEndPoint } from "tempeh";
import { object, string, boolean } from "zod";

const verifyJWT = createEndPoint({
  httpMethod: "GET",
  path: createRoute({
    fn: () => "/api/auth/two-factor/verify",
    name: "verifyJWT",
    paramsSchema: EmptyRouteConfig,
  }),
  SafeResponse: true,
  responseSchema: object({
    success: boolean(),
    message: string(),
  }),
});

export default verifyJWT;
