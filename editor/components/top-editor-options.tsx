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
  Table,
  Underline,
} from "lucide-react";
import { BubbleMenuBtn } from "./bubble-menu";
import { Editor } from "@tiptap/react";
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

const TopEditorOptions = ({ editor }: { editor: Editor | null }) => {
  return (
    <div className="p-2 border border-gray-50 w-full rounded-md">
      <div className="flex items-center gap-2">
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
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          active={editor?.isActive("bulletList")}
        >
          <ListIcon className="shrink-0 size-4 " />
        </BubbleMenuBtn>

        <ImageLoader />

        <BubbleMenuBtn
          onClick={() => {
            editor?.commands.createParagraphNear();

            editor
              ?.chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run();
          }}
        >
          <Table className="shrink-0 size-4" />
        </BubbleMenuBtn>

        <Select
          defaultValue="left"
          onValueChange={(value) => {
            editor?.chain().focus().setTextAlign(value).run();
          }}
        >
          <SelectTrigger
            className={buttonVariants({
              variant: "ghost",
              className: "w-fit p-2 shadow-none border-transparent",
            })}
          >
            <SelectValue placeholder="Select a fruit" />
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
      </div>
    </div>
  );
};

export default TopEditorOptions;
