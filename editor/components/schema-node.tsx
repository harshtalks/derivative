"use client";

import { Effect } from "effect";
import SchemaNode from "../dynamic-variables/components";
import { useInvoiceEditorContext } from "../editor-context";
import { effective } from "@/lib/effect.stuff";
import { succeed } from "effect/STM";
import { createSchemaVariables } from "../dynamic-variables/schema-variable";
import { deepKeys } from "deeks";
import { Badge } from "@/components/ui/badge";

type NestedObject = {
  [key: string]: any;
};

const getNestedValue = (obj: NestedObject, path: string[]): any =>
  path.reduce((acc, part) => acc && acc[part], obj);

const isArrayKey = (obj: NestedObject, key: string): boolean => {
  const parts = key.split(".");
  const parentPath = parts.slice(0, -1);
  const parent = getNestedValue(obj, parentPath);
  return Array.isArray(parent);
};

const getSchemaItems = (str: string) => {
  const json = JSON.parse(str);
  return createSchemaVariables(
    deepKeys(json, { expandArrayObjects: true }),
    (item) =>
      isArrayKey(json, item) ? (
        <div>
          {item}{" "}
          <Badge variant="outline" className="text-xs text-muted-foreground">
            Array
          </Badge>
        </div>
      ) : (
        item
      ),
  );
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
            {el.label}
          </SchemaNode.item>
        ))}
      </SchemaNode.List>
    </SchemaNode.root>
  );
};

export default SchemaVariables;
