"use client";

import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Italic from "@tiptap/extension-italic";
import Bold from "@tiptap/extension-bold";
import Document from "@tiptap/extension-document";
import Placeholder from "@tiptap/extension-placeholder";
import UnderlineNode from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import History from "@tiptap/extension-history";
import TextAlign from "@tiptap/extension-text-align";

import { Button } from "@/components/ui/button";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  BoldIcon,
  Highlighter,
  ItalicIcon,
  Underline,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef } from "react";

const BubbleMenuBtn = (
  props: ComponentPropsWithoutRef<typeof Button> & {
    active?: boolean;
    onClick: () => void;
  },
) => {
  return (
    <Button
      {...props}
      variant="ghost"
      className={cn(
        "border border-transparent p-2",
        props.active && "bg-zinc-100 border-zinc-200",
        props.className,
      )}
    >
      {props.children}
    </Button>
  );
};

const TemplateMarkup = ({
  markup,
  jsonStr,
}: {
  markup?: string;
  jsonStr: string;
}) => {
  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Italic,
      Bold,
      UnderlineNode,
      Placeholder.configure({
        placeholder: "Start typing...",
      }),
      Highlight,
      Typography,
      History,
      TextAlign.configure({
        defaultAlignment: "left",
        types: ["heading", "paragraph"],
      }),
    ],
    content: `
            <p>The Text extension is required, at least if you want to have text in your text editor and that’s very likely.</p>
          `,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none",
      },
    },
  });

  return (
    <div className="border p-12 overflow-y-auto  w-full">
      <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
        <div className="bg-zinc-50 p-1 flex items-center gap-1 shadow-[rgba(100,_100,_111,_0.2)_0px_7px_29px_0px] rounded-lg">
          <BubbleMenuBtn
            onClick={() => editor?.chain().focus().toggleBold().run()}
            active={editor?.isActive("bold")}
          >
            <BoldIcon className="shrink-0 size-4" />
          </BubbleMenuBtn>

          <BubbleMenuBtn
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            active={editor?.isActive("italic")}
          >
            <ItalicIcon className="shrink-0 size-4" />
          </BubbleMenuBtn>
          <BubbleMenuBtn
            onClick={() =>
              editor && editor.chain().focus().toggleUnderline().run()
            }
            active={editor?.isActive("underline")}
          >
            <Underline className="shrink-0 size-4" />
          </BubbleMenuBtn>
          <BubbleMenuBtn
            onClick={() => editor?.chain().focus().toggleHighlight().run()}
            active={editor?.isActive("highlight")}
          >
            <Highlighter className="shrink-0 size-4" />
          </BubbleMenuBtn>
          <BubbleMenuBtn
            onClick={() => {
              editor?.chain().focus().setTextAlign("left").run();
            }}
            active={editor?.isActive({
              textAlign: "left",
            })}
          >
            <AlignLeft className="shrink-0 size-4" />
          </BubbleMenuBtn>
          <BubbleMenuBtn
            onClick={() => {
              editor?.chain().focus().setTextAlign("center").run();
            }}
            active={editor?.isActive({
              textAlign: "center",
            })}
          >
            <AlignCenter className="shrink-0 size-4" />
          </BubbleMenuBtn>
          <BubbleMenuBtn
            onClick={() => {
              editor?.chain().focus().setTextAlign("right").run();
            }}
            active={editor?.isActive({
              textAlign: "right",
            })}
          >
            <AlignRight className="shrink-0 size-4" />
          </BubbleMenuBtn>
        </div>
      </BubbleMenu>
      <EditorContent
        style={{
          maxWidth: "21cm",
          minHeight: "29.7cm",
          maxHeight: "29.7cm",
        }}
        className="border p-12 rounded-md shadow-lg"
        editor={editor}
      />
    </div>
  );
};

export default TemplateMarkup;
