// input-tags.tsx

"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { type InputProps } from "./input";
import { cn } from "@/lib/utils";

type InputTagsProps = Omit<InputProps, "value" | "onChange"> & {
  value?: string[];
  onChange: React.Dispatch<React.SetStateAction<string[]>>;
};

const InputTags = React.forwardRef<HTMLInputElement, InputTagsProps>(
  ({ className, value = [], onChange, ...props }, ref) => {
    const [pendingDataPoint, setPendingDataPoint] = React.useState("");

    React.useEffect(() => {
      if (pendingDataPoint.includes(",")) {
        const newDataPoints = new Set([
          ...value,
          ...pendingDataPoint.split(",").map((chunk) => chunk.trim()),
        ]);
        onChange(Array.from(newDataPoints));
        setPendingDataPoint("");
      }
    }, [pendingDataPoint, onChange, value]);

    const addPendingDataPoint = () => {
      if (pendingDataPoint) {
        const newDataPoints = new Set([...value, pendingDataPoint]);
        onChange(Array.from(newDataPoints));
        setPendingDataPoint("");
      }
    };

    return (
      <div
        className={cn(
          // caveat: :has() variant requires tailwind v3.4 or above: https://tailwindcss.com/blog/tailwindcss-v3-4#new-has-variant
          "has-[:focus-visible]:outline-none has-[:focus-visible]:ring-1 has-[:focus-visible]:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-12 flex w-full flex-wrap gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950",
          className,
        )}
      >
        {value.map((item) => (
          <Badge key={item} className="py-1" variant={"secondary"}>
            {item}
            <Button
              type="button"
              onClick={() => {
                onChange(value.filter((i) => i !== item));
              }}
              variant="ghost"
              size="icon"
              className="ml-2 h-3 w-3"
            >
              <XIcon />
            </Button>
          </Badge>
        ))}
        <input
          className="flex-1 bg-white dark:bg-neutral-950 outline-none bg-none placeholder:text-neutral-500 dark:placeholder:text-neutral-400"
          value={pendingDataPoint}
          onChange={(e) => setPendingDataPoint(e.target.value)}
          onBlur={addPendingDataPoint}
          onKeyDown={(e) => {
            // fix: it works even when the input is not focused
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addPendingDataPoint();
            } else if (
              e.key === "Backspace" &&
              pendingDataPoint.length === 0 &&
              value.length > 0
            ) {
              e.preventDefault();
              onChange(value.slice(0, -1));
            }
          }}
          {...props}
          ref={ref}
        />
      </div>
    );
  },
);

InputTags.displayName = "InputTags";

export { InputTags };
