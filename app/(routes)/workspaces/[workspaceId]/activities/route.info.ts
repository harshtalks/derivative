import { EmptyRouteConfig } from "@/app/route.info";
import createRoute from "@/route.config";
import { object, string } from "zod";

const ActivitiesRoute = createRoute({
  name: "activities",
  fn: ({ workspaceId }) => `/workspaces/${workspaceId}/activities`,
  paramsSchema: object({
    workspaceId: string(),
  }),
});

export default ActivitiesRoute;
