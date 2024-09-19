"use client";

import { BubbleMenu, EditorContent } from "@tiptap/react";
import useInvoiceEditor from "../use-invoice-editor";
import { BubbleMenuWrapper } from "./bubble-menu";
import TopEditorOptions from "./top-editor-options";
import { useEffect } from "react";
import { useSelector } from "@xstate/store/react";
import imageStore from "../image-store";
import { TableMenu } from "./table-menu";

const Editor = () => {
  const { editor } = useInvoiceEditor();
  const { url } = useSelector(imageStore, (state) => state.context);

  useEffect(() => {
    if (editor && url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor, url]);

  return (
    <div className="p-2 flex flex-col gap-4 items-center justify-center overflow-y-auto w-full">
      <TopEditorOptions editor={editor} />
      <div>
        <TableMenu editor={editor} />
        <BubbleMenuWrapper editor={editor} />
        <EditorContent
          style={{
            maxWidth: "21cm",
            minHeight: "29.7cm",
            maxHeight: "29.7cm",
            minWidth: "21cm",
          }}
          className="border p-12 rounded-md shadow-2xl"
          editor={editor}
        />
      </div>
    </div>
  );
};

export default Editor;
