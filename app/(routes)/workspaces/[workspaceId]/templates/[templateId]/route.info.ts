import createRoute from "@/route.config";
import { object, string, infer as infer_ } from "zod";

export const templatePageParamsSchema = object({
  workspaceId: string(),
  templateId: string(),
});
export type TemplatePageSchema = infer_<typeof templatePageParamsSchema>;

const TemplatePageRouteInfo = createRoute({
  name: "template-schema",
  fn: ({ workspaceId, templateId }) =>
    `/workspaces/${workspaceId}/templates/${templateId}`,
  paramsSchema: templatePageParamsSchema,
});

export default TemplatePageRouteInfo;