"use client";
import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ptSerif, lora, openSans } from "@/fonts";
import { FontFamilyIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { useSelector } from "@xstate/store/react";
import { fontStore } from "@/stores/font-store";

function FontSelector() {
  const [isOpen, setIsOpen] = React.useReducer((prev) => !prev, false);
  const editorFont = useSelector(
    fontStore,
    (state) => state.context.editorFont,
  );

  return (
    <Select
      open={isOpen}
      value={editorFont}
      onValueChange={(value) =>
        fontStore.send({
          type: "changeEditorFont",
          value: value as `--${string}`,
        })
      }
      onOpenChange={setIsOpen}
    >
      <SelectTrigger
        className={clsx(
          "inline-flex gap-2 hover:bg-muted focus-within:outline-none focus-within:border-transparent focus:ring-0 outline-none border-transparent shadow-none",
          isOpen && "bg-muted",
        )}
      >
        <FontFamilyIcon className="shrink-0 size-4" />{" "}
        <SelectValue placeholder="Select a Font" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fonts</SelectLabel>
          <SelectItem value={ptSerif.variable}>PT Serif</SelectItem>
          <SelectItem value={lora.variable}>Lora</SelectItem>
          <SelectItem value={openSans.variable}>Open Sans</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default FontSelector;
