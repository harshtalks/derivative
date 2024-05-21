import { EmptyRouteConfig } from "@/app/route.info";
import createRoute from "@/route.config";
import { createEndPoint } from "tempeh";
import { literal, object, string, union, boolean } from "zod";
import * as z from "zod";

const signJWTBodySchema = union([
  object({ type: literal("registrationFlow"), webAuthId: string() }),
  object({ type: literal("authenticationFlow"), authId: string() }),
]);

const signJWT = createEndPoint({
  httpMethod: "POST",
  path: createRoute({
    paramsSchema: EmptyRouteConfig,
    fn: () => "/api/auth/two-factor/sign",
    name: "signJWT",
  }),
  bodySchema: signJWTBodySchema,
  SafeResponse: true,
  responseSchema: object({
    success: boolean(),
    message: string(),
  }),
});

export type SignJWTRequest = z.infer<typeof signJWTBodySchema>;

export default signJWT;
