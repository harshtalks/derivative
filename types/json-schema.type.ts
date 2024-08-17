import { JSONSchema7Object, type JSONSchema7 } from "json-schema";
import * as z from "zod";

const jsonObjectType = z.lazy<JSONSchema7Object>(() => ({}));

const jsonSchemaZod = z.object({
  title: z.string(),
  description: z.string(),
});
