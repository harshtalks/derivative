import React from "react";
import { cn, withRef } from "@udecode/cn";
import { getHandler, PlateElement } from "@udecode/plate-common";
import { useFocused, useSelected } from "slate-react";

export const MentionInputElement = withRef<
  typeof PlateElement,
  {
    onClick?: (mentionNode: any) => void;
  }
>(({ className, onClick, ...props }, ref) => {
  const { children, element } = props;

  const selected = useSelected();
  const focused = useFocused();

  return (
    <PlateElement
      ref={ref}
      asChild
      data-slate-value={element.value}
      className={cn(
        "inline-block rounded-md bg-muted px-1.5 py-0.5 align-baseline text-sm",
        selected && focused && "bg-zinc-100 dark:bg-zinc-800",
        className,
      )}
      onClick={getHandler(onClick, element)}
      {...props}
    >
      <span>{children}</span>
    </PlateElement>
  );
});
