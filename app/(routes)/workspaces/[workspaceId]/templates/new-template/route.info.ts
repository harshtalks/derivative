import { EmptyRouteConfig } from "@/app/route.info";
import createRoute from "@/route.config";
import { object, string } from "zod";

const NewTemplateRouteInfo = createRoute({
  name: "create-new-template",
  paramsSchema: object({
    workspaceId: string(),
  }),
  fn: ({ workspaceId }) => `/workspaces/${workspaceId}/templates/new-template`,
  searchParamsSchema: object({
    // we would want to pass the templateId if we are editing a template
    templateId: string().optional(),
  }),
});

export default NewTemplateRouteInfo;
