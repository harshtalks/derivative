"use client";

import { Effect } from "effect";
import SchemaNode from "../dynamic-variables/components";
import { useInvoiceEditorContext } from "../editor-context";
import { effective } from "@/lib/effect.stuff";
import { succeed } from "effect/STM";
import { createSchemaVariables } from "../dynamic-variables/schema-variable";
import { deepKeys } from "deeks";

const getSchemaItems = (str: string) => {
  return createSchemaVariables(deepKeys(JSON.parse(str)));
};

const SchemaVariables = ({ json }: { json: string }) => {
  const editor = useInvoiceEditorContext();
  const schemaItems = getSchemaItems(json);

  return (
    <SchemaNode.root editor={editor}>
      <SchemaNode.List>
        <SchemaNode.Empty>No variables available</SchemaNode.Empty>
        {schemaItems.map((el) => (
          <SchemaNode.item
            onCommand={el.command}
            key={el.value}
            value={el.value}
          >
            {el.value}
          </SchemaNode.item>
        ))}
      </SchemaNode.List>
    </SchemaNode.root>
  );
};

export default SchemaVariables;
