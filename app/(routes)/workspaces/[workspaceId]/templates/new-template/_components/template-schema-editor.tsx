"use client";
import { cn } from "@/lib/utils";
import { CodeiumEditor } from "@codeium/react-code-editor";
import { useTheme } from "next-themes";
import { ComponentPropsWithoutRef } from "react";

export const DEFAULT_SCHEMA = JSON.stringify(
  {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "Generated schema for Root",
    type: "object",
    properties: {
      userId: {
        type: "number",
      },
      id: {
        type: "number",
      },
      title: {
        type: "string",
      },
      completed: {
        type: "boolean",
      },
    },
    required: ["userId", "id", "title", "completed"],
  },
  null,
  2,
);

export const DEFAULT_SCHEMA_JSON = JSON.stringify(
  {
    userId: 1,
    id: 1,
    title: "delectus aut autem",
    completed: false,
  },
  null,
  2,
);

const TemplateSchemaEditor = (
  props: Partial<ComponentPropsWithoutRef<typeof CodeiumEditor>> & {
    containerClassName?: string;
  },
) => {
  const { theme } = useTheme();
  return (
    <CodeiumEditor
      language="json"
      theme={theme === "dark" ? "vs-dark" : "vs-light"}
      {...props}
      containerClassName={cn(
        "!border overflow-auto !focus-within:ring rounded-md",
        props.containerClassName,
      )}
    />
  );
};

export default TemplateSchemaEditor;
