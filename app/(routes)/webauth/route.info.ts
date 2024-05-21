import createRoute from "@/route.config";
import { object, string } from "zod";

const WebAuthRoute = createRoute({
  name: "webauth-route",
  fn: () => "/webauth",
  paramsSchema: object({}),
  searchParamsSchema: object({
    redirectUrl: string().url().optional(),
  }),
});

export default WebAuthRoute;
