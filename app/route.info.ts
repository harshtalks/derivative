import { createRoute } from "tempeh";
import * as z from "zod";

export const EmptyRouteConfig = z.object({});

// declarative route definition
const HomePageRoute = createRoute({
  name: "homepage",
  fn: () => "/",
  paramsSchema: EmptyRouteConfig,
  options: {
    internal: true,
  },
});

export default HomePageRoute;
