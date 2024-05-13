import createRoute from "@/route.config";
import * as z from "zod";

export const EmptyRouteConfig = z.object({});

// declarative route definition

const HomePageRoute = createRoute({
  fn: () => "/",
  name: "HomePageRoute",
  paramsSchema: EmptyRouteConfig,
});

export default HomePageRoute;
