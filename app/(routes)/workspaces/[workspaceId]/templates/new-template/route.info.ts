import { EmptyRouteConfig } from "@/app/route.info";
import createRoute from "@/route.config";
import { object, string } from "zod";

const NewTemplateRouteInfo = createRoute({
  name: "create-new-template",
  paramsSchema: object({
    workspaceId: string(),
  }),
  fn: ({ workspaceId }) => `/workspaces/${workspaceId}/templates/new-template`,
});

export default NewTemplateRouteInfo;
