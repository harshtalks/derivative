import { EmptyRouteConfig } from "@/app/route.info";
import createRoute from "@/route.config";
import { array, object, string, enum as enum_ } from "zod";

const SignInPage = createRoute({
  name: "sign-in",
  fn: () => "/sign-in",
  paramsSchema: EmptyRouteConfig,
  searchParamsSchema: object({
    redirectUrl: string().optional(),
  }),
});

export default SignInPage;
