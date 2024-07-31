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
import { ptSerif } from "@/fonts";
import { FontFamilyIcon } from "@radix-ui/react-icons";
import clsx from "clsx";

function FontSelector() {
  const [isOpen, setIsOpen] = React.useReducer((prev) => !prev, false);
  return (
    <Select open={isOpen} onOpenChange={setIsOpen}>
      <SelectTrigger
        className={clsx(
          "inline-flex gap-2 hover:bg-muted focus-within:outline-none outline-none border-transparent shadow-none",
          isOpen && "bg-muted"
        )}
      >
        <FontFamilyIcon className="shrink-0 size-4" />{" "}
        <SelectValue placeholder="Select a Font" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fonts</SelectLabel>
          <SelectItem value={ptSerif.variable}>PT Serif</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
          <SelectItem value="grapes">Grapes</SelectItem>
          <SelectItem value="pineapple">Pineapple</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default FontSelector;
