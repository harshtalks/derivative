import { createRoute } from "tempeh";
import { object } from "zod";

const route = createRoute({
  name: "/",
  fn: () => "/",
  paramsSchema: object({}),
  options: {
    internal: true,
  },
});
