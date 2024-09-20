import { useInvoiceEditorContext } from "@/editor/editor-context";
import { Editor, Range as TRange } from "@tiptap/react";
import { useSelector } from "@xstate/store/react";
import { slashStore } from "../slash-store";
import { ComponentPropsWithoutRef } from "react";
import { CommandEmpty, CommandItem } from "cmdk";

interface SlashCommandItemProps {
  readonly onCommand: ({
    editor,
    range,
  }: {
    editor: Editor;
    range: TRange;
  }) => void;
}

export const SlashCommandEmpty = CommandEmpty;

const SlashCommandItem = (
  props: SlashCommandItemProps & ComponentPropsWithoutRef<typeof CommandItem>,
) => {
  const editor = useInvoiceEditorContext();
  const range = useSelector(slashStore, (st) => st.context.range);

  if (!range) return null;

  return (
    <CommandItem {...props} onSelect={() => props.onCommand({ editor, range })}>
      {props.children}
    </CommandItem>
  );
};

export default SlashCommandItem;
