import { EmptyRouteConfig } from "@/app/route.info";
import createRoute from "@/route.config";
import { createEndPoint } from "tempeh";
import { literal, object, string, boolean } from "zod";
import * as z from "zod";

export const TFDisableResponse = object({
  message: string(),
  success: boolean(),
});

const TFDisable = createEndPoint({
  SafeResponse: true,
  responseSchema: TFDisableResponse,
  httpMethod: "POST",
  bodySchema: object({
    value: literal(false),
  }),
  path: createRoute({
    name: "two-factor-auth-disable",
    fn: () => "/api/auth/two-factor/disable",
    paramsSchema: EmptyRouteConfig,
  }),
});

export default TFDisable;

export type TFDisableResponse = z.infer<typeof TFDisableResponse>;
