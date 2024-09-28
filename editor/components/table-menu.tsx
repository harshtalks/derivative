"use client";

import { BubbleMenu } from "@tiptap/react";
import { useInvoiceEditorContext } from "../editor-context";
import { Button } from "@/components/ui/button";

const TableMenu = () => {
  const editor = useInvoiceEditorContext();

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100 }}
      shouldShow={({ editor }) => {
        const { state } = editor;
        const { selection } = state;
        if (!editor.isActive("table")) {
          return true;
        }
        let depth = selection.$anchor.depth;
        while (depth > 0) {
          const node = selection.$anchor.node(depth);
          if (node.type.name === "table") {
            return true;
          }
          depth--;
        }
        return false;
      }}
    >
      <div className="bg-zinc-50 p-2 flex items-center gap-1 shadow-[rgba(100,_100,_111,_0.2)_0px_7px_29px_0px] rounded-lg">
        <Button variant="secondary">Add Row After</Button>
      </div>
    </BubbleMenu>
  );
};

export default TableMenu;
