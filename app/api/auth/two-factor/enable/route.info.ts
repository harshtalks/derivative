import { EmptyRouteConfig } from "@/app/route.info";
import createRoute from "@/route.config";
import { createEndPoint } from "tempeh";
import { boolean, literal, object, string } from "zod";

const enableTF = createEndPoint({
  httpMethod: "POST",
  SafeResponse: true,
  path: createRoute({
    name: "two-factor-auth-enable",
    fn: () => "/api/auth/two-factor/enable",
    paramsSchema: EmptyRouteConfig,
  }),
  bodySchema: object({
    value: literal(true),
  }),
  responseSchema: object({
    success: boolean(),
    message: string(),
  }),
});

export default enableTF;
