import { EmptyRouteConfig } from "@/app/route.info";
import { env } from "@/env";
import createRoute from "@/route.config";

const ValidateGithubAuth = createRoute({
  fn: () => "/api/auth/github/verify",
  name: "validate-github-auth",
  paramsSchema: EmptyRouteConfig,
  baseUrl: env.BASE_URL,
});

export default ValidateGithubAuth;
