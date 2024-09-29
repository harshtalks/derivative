"use client";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  BoldIcon,
  Highlighter,
  Image as ImageIcon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  Redo,
  Redo2,
  Table,
  Underline,
  Undo,
  Undo2,
} from "lucide-react";
import { BubbleMenuBtn } from "./bubble-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { buttonVariants } from "@/components/ui/button";
import ImageLoader from "./image-loader";
import { useInvoiceEditorContext } from "../editor-context";
import { Level } from "@tiptap/extension-heading";

const TopEditorOptions = () => {
  const editor = useInvoiceEditorContext();
  return (
    <div className="p-2 fixed left-1/2 bg-white z-20 -translate-x-1/2 w-fit bottom-[40px] shadow-2xl rounded-md">
      <div className="flex items-center gap-2">
        <BubbleMenuBtn
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
        >
          <BoldIcon className="shrink-0 size-4" />
        </BubbleMenuBtn>

        <BubbleMenuBtn
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
        >
          <ItalicIcon className="shrink-0 size-4" />
        </BubbleMenuBtn>
        <BubbleMenuBtn
          onClick={() =>
            editor && editor.chain().focus().toggleUnderline().run()
          }
          active={editor.isActive("underline")}
        >
          <Underline className="shrink-0 size-4" />
        </BubbleMenuBtn>
        <BubbleMenuBtn
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          active={editor.isActive("highlight")}
        >
          <Highlighter className="shrink-0 size-4" />
        </BubbleMenuBtn>
        <BubbleMenuBtn
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
        >
          <ListIcon className="shrink-0 size-4 " />
        </BubbleMenuBtn>

        <BubbleMenuBtn
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
        >
          <ListOrderedIcon className="shrink-0 size-4 " />
        </BubbleMenuBtn>

        <ImageLoader />

        <BubbleMenuBtn
          onClick={() => {
            editor?.chain().focus().insertTable({ rows: 3, cols: 3 }).run();
          }}
        >
          <Table className="shrink-0 size-4" />
        </BubbleMenuBtn>

        <Select
          defaultValue="left"
          onValueChange={(value) => {
            editor.chain().focus().setTextAlign(value).run();
          }}
        >
          <SelectTrigger
            className={buttonVariants({
              variant: "ghost",
              className: "w-fit p-2 pr-0 shadow-none border-transparent",
            })}
          >
            <SelectValue placeholder="Select alignment" />
          </SelectTrigger>
          <SelectContent className="w-fit">
            <SelectGroup>
              <SelectItem value="left">
                <AlignLeft className="shrink-0 size-4" />
              </SelectItem>
              <SelectItem value="center">
                <AlignCenter className="shrink-0 size-4" />
              </SelectItem>
              <SelectItem value="right">
                <AlignRight className="shrink-0 size-4" />
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) => {
            editor
              .chain()
              .focus()
              .toggleHeading({ level: +value as Level })
              .run();
          }}
        >
          <SelectTrigger
            className={buttonVariants({
              variant: "ghost",
              className:
                "w-fit p-2 text-xs pr-0 shadow-none border-transparent",
            })}
          >
            <SelectValue className="text-xs" placeholder="Heading Level" />
          </SelectTrigger>
          <SelectContent className="w-fit">
            <SelectGroup>
              {Array.from({ length: 6 }).map((_, i) => (
                <SelectItem
                  className="text-xs"
                  key={i}
                  value={(i + 1).toString()}
                >
                  <h1 className={`text-h${i + 1}`}>Heading {i + 1}</h1>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <BubbleMenuBtn
          onClick={() => editor.chain().focus().undo().run()}
          active={editor.isActive("bulletList")}
        >
          <Undo2 className="shrink-0 size-4 " />
        </BubbleMenuBtn>

        <BubbleMenuBtn
          onClick={() => editor.chain().focus().redo().run()}
          active={editor.isActive("bulletList")}
        >
          <Redo2 className="shrink-0 size-4 " />
        </BubbleMenuBtn>
      </div>
    </div>
  );
};

export default TopEditorOptions;
