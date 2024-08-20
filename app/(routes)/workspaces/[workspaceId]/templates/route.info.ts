import createRoute from "@/route.config";
import { object, string } from "zod";

const templatesPageRoute = createRoute({
  fn: ({ workspaceId }) => `/workspaces/${workspaceId}/templates`,
  name: "templates-page",
  paramsSchema: object({
    workspaceId: string(),
  }),
});

export default templatesPageRoute;
