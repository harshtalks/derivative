import createRoute from "@/route.config";
import { number, object, string } from "zod";

const templatesPageRoute = createRoute({
  fn: ({ workspaceId }) => `/workspaces/${workspaceId}/templates`,
  name: "templates-page",
  paramsSchema: object({
    workspaceId: string(),
  }),
  searchParamsSchema: object({
    page: number({ coerce: true }).default(1),
  }),
});

export default templatesPageRoute;
