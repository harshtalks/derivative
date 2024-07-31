import createRoute from "@/route.config";
import { object, string, infer as infer_ } from "zod";
import { templatePageParamsSchema } from "../route.info";

const TemplatePageEditorRouteInfo = createRoute({
  name: "template-editor",
  fn: ({ workspaceId, templateId }) =>
    `/workspaces/${workspaceId}/templates/${templateId}/editor`,
  paramsSchema: templatePageParamsSchema,
});

export default TemplatePageEditorRouteInfo;
