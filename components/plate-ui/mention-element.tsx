import React from "react";
import { cn, withRef } from "@udecode/cn";
import { getHandler, PlateElement, useElement } from "@udecode/plate-common";
import { TMentionElement } from "@udecode/plate-mention";
import { useFocused, useSelected } from "slate-react";

export const MentionElement = withRef<
  typeof PlateElement,
  {
    prefix?: string;
    onClick?: (mentionNode: any) => void;
    renderLabel?: (mentionable: TMentionElement) => string;
  }
>(({ children, prefix, renderLabel, className, onClick, ...props }, ref) => {
  const element = useElement<TMentionElement>();
  const selected = useSelected();
  const focused = useFocused();

  return (
    <PlateElement
      ref={ref}
      className={cn(
        "inline",
        selected && focused && "underline underline-offset-1",
        className,
      )}
      data-slate-value={element.value}
      contentEditable={false}
      onClick={getHandler(onClick, element)}
      {...props}
    >
      {prefix}
      {renderLabel ? renderLabel(element) : element.value}
      {children}
    </PlateElement>
  );
});
