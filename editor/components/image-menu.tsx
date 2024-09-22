"use client";

import { BubbleMenu, isNodeSelection } from "@tiptap/react";
import { useInvoiceEditorContext } from "../editor-context";
import { BubbleMenuBtn } from "./bubble-menu";
import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";

export const variants = {
  left: `margin-right:0 auto`,
  center: `margin: 0 auto;`,
  right: `margin-left: auto;`,
};

const ImageMenu = () => {
  const editor = useInvoiceEditorContext();

  const updateImageAlignment = (key: keyof typeof variants) => {
    const currentImage = document.querySelector<HTMLImageElement>(
      ".ProseMirror-selectednode",
    );

    if (currentImage) {
      const selection = editor.state.selection;
      const setImage = editor.commands.setImage as (options: {
        src: string;
        alt?: string;
        title?: string;
        style: string;
        height: number;
        width: number;
        "data-alignment": keyof typeof variants;
      }) => boolean;

      setImage({
        src: currentImage.src,
        alt: currentImage.alt,
        title: currentImage.title,
        style: variants[key],
        height: currentImage.height,
        width: currentImage.width,
        "data-alignment": key,
      });

      editor.commands.setNodeSelection(selection.from);
    }
  };

  const currentValue = () => {
    const imageInfo = document.querySelector(
      ".ProseMirror-selectednode",
    ) as HTMLImageElement;

    if (imageInfo && imageInfo.getAttribute("data-alignment")) {
      return imageInfo.getAttribute("data-alignment");
    }

    return "center";
  };

  return (
    <BubbleMenu
      shouldShow={({ editor, state }) => {
        const { selection } = state;
        const { empty } = selection;

        // don't show bubble menu if:
        // - the editor is not editable
        // - the selected node is not an image
        // - the selection is empty
        // - the selection is a node selection (for drag handles)
        return editor.isActive("image") || editor.isActive("link");
      }}
      editor={editor}
      tippyOptions={{ duration: 100 }}
    >
      <div className="bg-zinc-50 p-1 flex items-center gap-1 shadow-[rgba(100,_100,_111,_0.2)_0px_7px_29px_0px] rounded-lg">
        <BubbleMenuBtn
          active={currentValue() === "left"}
          onClick={() => {
            updateImageAlignment("left");
          }}
        >
          <AlignLeft className="shrink-0 size-4" />
        </BubbleMenuBtn>
        <BubbleMenuBtn
          onClick={() => {
            updateImageAlignment("center");
          }}
          active={currentValue() === "center"}
        >
          <AlignCenter className="shrink-0 size-4" />
        </BubbleMenuBtn>
        <BubbleMenuBtn
          onClick={() => {
            updateImageAlignment("right");
          }}
          active={currentValue() === "right"}
        >
          <AlignRight className="shrink-0 size-4" />
        </BubbleMenuBtn>
      </div>
    </BubbleMenu>
  );
};

export default ImageMenu;
