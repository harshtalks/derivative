import { EditorContent } from "@tiptap/react";
import { useInvoiceEditorContext } from "../editor-context";
import useOneTimeEffect from "@/lib/effect-once";

const Content = ({ value }: { value: string }) => {
  const editor = useInvoiceEditorContext();

  useOneTimeEffect(() => {
    editor.commands.setContent(value);
  });

  return (
    <EditorContent
      style={{
        maxWidth: "21cm",
        minHeight: "29.7cm",
        maxHeight: "29.7cm",
        minWidth: "21cm",
      }}
      className="border p-12 bg-white rounded-md shadow-2xl"
      editor={editor}
      value={"<p>hello</p>"}
    />
  );
};

export default Content;
