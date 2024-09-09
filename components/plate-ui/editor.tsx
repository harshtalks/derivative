import React, { useEffect } from "react";
import { cn } from "@udecode/cn";
import { PlateContent } from "@udecode/plate-common";
import { cva } from "class-variance-authority";

import type { PlateContentProps } from "@udecode/plate-common";
import type { VariantProps } from "class-variance-authority";
import { ptSerif, lora, openSans } from "@/fonts";
import { useSelector } from "@xstate/store/react";
import { fontStore } from "@/stores/font-store";
import { toast } from "sonner";

const fonts = [ptSerif, lora, openSans];

const editorVariants = cva(
  cn(
    "relative overflow-x-auto whitespace-pre-wrap break-words",
    "min-h-[80px] w-full rounded-md bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none",
    "[&_[data-slate-placeholder]]:text-muted-foreground [&_[data-slate-placeholder]]:!opacity-100",
    "[&_[data-slate-placeholder]]:top-[auto_!important]",
    "[&_strong]:font-bold",
  ),
  {
    variants: {
      variant: {
        outline: "border border-input",
        ghost: "",
      },
      focused: {
        true: "ring-2 ring-ring ring-offset-2",
      },
      disabled: {
        true: "cursor-not-allowed opacity-50",
      },
      focusRing: {
        true: "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        false: "",
      },
      size: {
        sm: "text-sm",
        md: "text-base",
      },
    },
    defaultVariants: {
      variant: "outline",
      focusRing: true,
      size: "sm",
    },
  },
);

export type EditorProps = PlateContentProps &
  VariantProps<typeof editorVariants>;

const Editor = React.forwardRef<HTMLDivElement, EditorProps>(
  (
    {
      className,
      disabled,
      focused,
      focusRing,
      readOnly,
      size,
      variant,
      ...props
    },
    ref,
  ) => {
    const currentFontVariable = useSelector(
      fontStore,
      (state) => state.context.editorFont,
    );

    const font =
      fonts.find((el) => el.variable === currentFontVariable) || ptSerif;

    const containerRef = React.useRef<HTMLDivElement>(null);

    return (
      <div
        ref={ref}
        className={cn(
          "relative border mx-auto my-6 shadow-2xl rounded-md overflow-clip",
          font.className,
        )}
        data-editorWrapper
        style={{
          maxWidth: "21cm",
          minHeight: "29.7cm",
          maxHeight: "29.7cm",
        }}
      >
        <div className="h-full w-full">
          <PlateContent
            className={cn(
              editorVariants({
                disabled,
                focused,
                focusRing,
                size,
                variant,
              }),
              className,
              "overflow-clip",
            )}
            disableDefaultStyles
            readOnly={disabled ?? readOnly}
            aria-disabled={disabled}
          />
        </div>
      </div>
    );
  },
);
Editor.displayName = "Editor";

export { Editor };
