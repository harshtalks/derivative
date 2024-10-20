import { templateStatus } from "@/database/schema";
import createRoute from "@/route.config";
import { number, object, string, enum as enum_ } from "zod";

const templatesPageRoute = createRoute({
  fn: ({ workspaceId }) => `/workspaces/${workspaceId}/templates`,
  name: "templates-page",
  paramsSchema: object({
    workspaceId: string(),
  }),
  searchParamsSchema: object({
    page: number({ coerce: true }).default(1),
    status: enum_(templateStatus).optional(),
  }),
});

export default templatesPageRoute;
