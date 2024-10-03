import { EditorContent, useEditor } from "@tiptap/react";
import { useInvoiceEditorContext } from "../editor-context";
import useOneTimeEffect from "@/lib/effect-once";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Handlebars from "handlebars";
import useInvoiceEditor from "../use-invoice-editor";

const Content = ({
  value,
  readOnly,
  json,
}: {
  value: string;
  readOnly?: boolean;
  json: string;
}) => {
  const editor = useInvoiceEditorContext();
  const { editor: readOnlyEditor } = useInvoiceEditor();

  useOneTimeEffect(() => {
    editor.commands.setContent(value);
  });

  useEffect(() => {
    if (readOnly && readOnlyEditor) {
      readOnlyEditor.setOptions({
        editable: !readOnly,
      });

      readOnlyEditor.commands.setContent(
        Handlebars.compile(editor.getHTML())(JSON.parse(json)),
      );
    }
  }, [readOnly]);

  useEffect(() => {}, [readOnly]);

  return (
    <>
      <AnimatePresence>
        {readOnly && (
          <motion.div
            initial={{
              opacity: 0,
              y: -10,
              x: "-50%",
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -10,
            }}
            className="fixed top-10 p-4 text-xs border text-muted-foreground rounded-md shadow-2xl left-1/2 z-20 bg-white"
          >
            You are in <span className="font-bold">review</span> mode. You
            won&apos;t be able to edit the content.
          </motion.div>
        )}
      </AnimatePresence>

      <EditorContent
        style={{
          maxWidth: "21cm",
          minHeight: "29.7cm",
          maxHeight: "29.7cm",
          minWidth: "21cm",
        }}
        data-read-only={readOnly}
        className="border data-[read-only=true]:border-black p-12 bg-white rounded-md transition-all duration-200 shadow-2xl"
        editor={readOnly ? readOnlyEditor : editor}
      />
    </>
  );
};

export default Content;
