"use client";

import SchemaNode from "../dynamic-variables/components";
import { useInvoiceEditorContext } from "../editor-context";

const items = [
  {
    value: "name",
  },
  {
    value: "email",
  },
  {
    value: "phone",
  },
  {
    value: "address",
  },
  {
    value: "city",
  },
  {
    value: "state",
  },
  {
    value: "zip",
  },
  {
    value: "country",
  },
  {
    value: "invoiceNumber",
  },
  {
    value: "invoiceDate",
  },
  {
    value: "dueDate",
  },
  {
    value: "notes",
  },
  {
    value: "total",
  },
  {
    value: "tax",
  },
  {
    value: "discount",
  },
  {
    value: "items",
  },
  {
    value: "item",
  },
  {
    value: "description",
  },
  {
    value: "quantity",
  },
  {
    value: "price",
  },
  {
    value: "amount",
  },
];

const SchemaVariables = () => {
  const editor = useInvoiceEditorContext();

  return (
    <SchemaNode.root editor={editor}>
      <SchemaNode.List>
        <SchemaNode.Empty>No variables available</SchemaNode.Empty>
        {items.map((el) => (
          <SchemaNode.item
            onCommand={(v) => {}}
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
