import { EmptyRouteConfig } from "@/app/route.info";
import { createRoute } from "tempeh";

const SignInPage = createRoute({
  name: "sign-in",
  fn: () => "/sign-in",
  paramsSchema: EmptyRouteConfig,
  options: {
    internal: true,
  },
});

export default SignInPage;
