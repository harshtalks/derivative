import React from "react";
import { cn, withRef } from "@udecode/cn";
import { getHandler, PlateElement, useElement } from "@udecode/plate-common";
import { TMentionElement } from "@udecode/plate-mention";

export const MentionElement = withRef<
  typeof PlateElement,
  {
    prefix?: string;
    onClick?: (mentionNode: any) => void;
    renderLabel?: (mentionable: TMentionElement) => string;
  }
>(({ children, prefix, renderLabel, className, onClick, ...props }, ref) => {
  const element = useElement<TMentionElement>();

  return (
    <PlateElement
      ref={ref}
      className={cn("inline-block", className)}
      data-slate-value={element.value}
      contentEditable={false}
      onClick={getHandler(onClick, element)}
      {...props}
    >
      {prefix}
      {"{{"}
      {renderLabel ? renderLabel(element) : element.value}
      {"}}"}
      {children}
    </PlateElement>
  );
});
