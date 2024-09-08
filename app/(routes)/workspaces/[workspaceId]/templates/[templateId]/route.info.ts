import createRoute from "@/route.config";
import { object, string, infer as infer_, enum as enum_, boolean } from "zod";

export const templatePageParamsSchema = object({
  workspaceId: string(),
  templateId: string(),
});

const TemplatePageRouteInfo = createRoute({
  name: "template-schema",
  fn: ({ workspaceId, templateId }) =>
    `/workspaces/${workspaceId}/templates/${templateId}`,
  paramsSchema: templatePageParamsSchema,
  searchParamsSchema: object({
    active: enum_([
      "inbox",
      "schema",
      "integration",
      "template-markup",
    ]).default("inbox"),
    sampled: enum_(["true", "false"])
      .default("false")
      .transform((el) => el === "true"),
  }),
});

export default TemplatePageRouteInfo;
