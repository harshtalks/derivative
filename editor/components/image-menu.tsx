"use client";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ImageAligner } from "@harshtalks/image-tiptap";
import { BubbleMenu, Editor } from "@tiptap/react";
import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";
import useInvoiceEditor from "../use-invoice-editor";
import { useSelector } from "@xstate/store/react";
import imageStore from "../image-store";
import { useEffect } from "react";

const ImageMenu = () => {
  const btnClass = buttonVariants({
    variant: "ghost",
    className: cn(
      "border text-black border-transparent !p-2",
      "data-[isactive=true]:bg-zinc-100 data-[isactive=true]:border-zinc-200",
    ),
  });

  const { editor } = useInvoiceEditor();
  const { url } = useSelector(imageStore, (state) => state.context);

  useEffect(() => {
    if (editor && url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor, url]);

  return (
    <ImageAligner.Root editor={editor}>
      <ImageAligner.AlignMenu>
        <ImageAligner.Items className="bg-zinc-50 p-1 flex items-center gap-1 shadow-[rgba(100,_100,_111,_0.2)_0px_7px_29px_0px] rounded-lg">
          <ImageAligner.Item alignment="left" className={btnClass}>
            <AlignLeft className="shrink-0 size-4" />
          </ImageAligner.Item>
          <ImageAligner.Item alignment="center" className={btnClass}>
            <AlignCenter className="shrink-0 size-4" />
          </ImageAligner.Item>
          <ImageAligner.Item alignment="right" className={btnClass}>
            <AlignRight className="shrink-0 size-4" />
          </ImageAligner.Item>
        </ImageAligner.Items>
      </ImageAligner.AlignMenu>
    </ImageAligner.Root>
  );
};

export default ImageMenu;
