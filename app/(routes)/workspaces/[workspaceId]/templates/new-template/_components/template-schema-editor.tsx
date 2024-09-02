"use client";
import { cn } from "@/lib/utils";
import { CodeiumEditor } from "@codeium/react-code-editor";
import { useTheme } from "next-themes";
import { ComponentPropsWithoutRef } from "react";

export const DEFAULT_SCHEMA = JSON.stringify(
  {
    _comment:
      "Generate valid json schema. you can use ai to generate your schema as well.",
    title: "Person",
    type: "object",
    properties: {
      firstName: {
        type: "string",
        description: "The person's first name.",
      },
      lastName: {
        type: "string",
        description: "The person's last name.",
      },
      age: {
        description:
          "Age in years which must be equal to or greater than zero.",
        type: "integer",
        minimum: 0,
      },
    },
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
