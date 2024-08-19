import * as z from "zod";

export const jsonSchemaType = z.enum([
  "string",
  "number",
  "boolean",
  "object",
  "array",
]);

export const jsonSchemaProperty = z.object({
  type: jsonSchemaType,
  fieldName: z.string().optional(),
  description: z.string().optional(),
  required: z.boolean().optional(),
});

export const jsonSchemaObject = z.object({
  properties: z.array(jsonSchemaProperty),
  title: z.string().optional(),
  description: z.string().optional(),
  type: z.literal("object"),
});
