"use client";

import { EditorContent } from "@tiptap/react";
import useInvoiceEditor from "../use-invoice-editor";
import { BubbleMenuWrapper } from "./bubble-menu";
import TopEditorOptions from "./top-editor-options";
import { useSelector } from "@xstate/store/react";
import imageStore from "../image-store";
import { InvoiceEditorContextProvider } from "../editor-context";
import SlashCommand, { SlashCommandList } from "../slash/components/command";
import SlashCommandItem, { SlashCommandEmpty } from "../slash/components/item";
import { handleCommandNavigation, slashSuggestions } from "../slash/command";
import SlashCommandRoot from "../slash/components";
import { ImageResizer } from "../image-resize";
import { useEffect } from "react";

const Editor = () => {
  const { editor } = useInvoiceEditor();
  const { url } = useSelector(imageStore, (state) => state.context);

  useEffect(() => {
    if (editor && url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor, url]);

  if (!editor) {
    return null;
  }

  return (
    <InvoiceEditorContextProvider editor={editor}>
      <SlashCommandRoot>
        <BubbleMenuWrapper />
        <div className="p-2 flex flex-col pb-24 gap-4 items-center justify-center overflow-y-auto w-full">
          <TopEditorOptions />
          <div>
            <BubbleMenuWrapper />
            <SlashCommand>
              <SlashCommandEmpty>No results found</SlashCommandEmpty>
              <SlashCommandList>
                {slashSuggestions.map((item) => (
                  <SlashCommandItem
                    value={item.title}
                    onCommand={(val) => item.command(val)}
                    className="flex w-full items-center space-x-2 cursor-pointer rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent"
                    key={item.title}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </SlashCommandItem>
                ))}
              </SlashCommandList>
            </SlashCommand>
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
            <ImageResizer />
          </div>
        </div>
      </SlashCommandRoot>
    </InvoiceEditorContextProvider>
  );
};

export default Editor;