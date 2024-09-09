import { InvoiceMarkup } from "@/database/local-store";
import { templateMarkups, templates } from "@/database/schema";
import { initialValue } from "./markup";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Plate, PlateEditor, createPlateEditor } from "@udecode/plate-common";
import { CommentsPopover } from "@/components/plate-ui/comments-popover";
import { CursorOverlay } from "@/components/plate-ui/cursor-overlay";
import { Editor } from "@/components/plate-ui/editor";
import { FixedToolbar } from "@/components/plate-ui/fixed-toolbar";
import { FixedToolbarButtons } from "@/components/plate-ui/fixed-toolbar-buttons";
import { FloatingToolbar } from "@/components/plate-ui/floating-toolbar";
import { FloatingToolbarButtons } from "@/components/plate-ui/floating-toolbar-buttons";
import { MentionCombobox } from "@/components/plate-ui/mention-combobox";
import { cn } from "@udecode/cn";
import { plugins } from "@/lib/plate/plate-plugins";
import { updateDraft } from "@/database/local-store";
import Branded from "@/types/branded.type";
import { fontStore } from "@/stores/font-store";
import { useSelector } from "@xstate/store/react";
import { toast } from "sonner";
import { getSchemaKeys } from "./invoice-editor";
import { useEffect, useRef, useState } from "react";
import { createStore } from "@xstate/store";
import { useQueryClient } from "@tanstack/react-query";

const Playground = ({
  template,
  markup,
  localMarkup: data,
}: {
  template: typeof templates.$inferSelect;
  markup: typeof templateMarkups.$inferSelect | null;
  localMarkup: InvoiceMarkup["invoice-markup"]["value"] | null;
}) => {
  const getUpdatedMarkup = () => {
    const localMarkup = data ? JSON.parse(data.markup) : null;
    const remoteMarkup = markup ? JSON.parse(markup.markup) : null;

    if (localMarkup && remoteMarkup) {
      const localLastUpdated = data?.lastUpdated && new Date(data.lastUpdated);
      const remoteLastUpdated = markup?.updatedAt && new Date(markup.updatedAt);

      if (localLastUpdated && remoteLastUpdated) {
        return localLastUpdated > remoteLastUpdated
          ? localMarkup
          : remoteMarkup;
      } else if (localLastUpdated && !remoteLastUpdated) {
        return localMarkup;
      } else if (!localLastUpdated && remoteLastUpdated) {
        return remoteMarkup;
      }
    }

    return localMarkup || remoteMarkup || initialValue;
  };

  const containerRef = useRef(null);

  const schemaKeys = () => getSchemaKeys(template.json);

  const fontfamily = useSelector(
    fontStore,
    (state) => state.context.editorFont,
  );

  const ref = useRef<PlateEditor>(null);
  const toastRef = useRef(0);

  return (
    <DndProvider backend={HTML5Backend}>
      <Plate
        plugins={plugins}
        editorRef={ref}
        onChange={async (data) => {
          if (!ref.current) {
            toast.error("something went wrong");
          }

          const editorElement = document.querySelector<HTMLDivElement>(
            '[data-slate-editor="true"]',
          );

          const containerEl = document.querySelector<HTMLDivElement>(
            '[data-editorWrapper="true"]',
          );

          if (!editorElement || !containerEl) {
            toast.error(
              "You have exceeded the page height limit for an A4 Sheet. It won't be saved.",
              {
                id: toastRef.current,
                duration: Infinity,
              },
            );
            return;
          }

          if (
            editorElement.getBoundingClientRect().height >
            containerEl.getBoundingClientRect().height
          ) {
            // undo until height is adjusted

            toast.error(
              "You have exceeded the page height limit for an A4 Sheet. It won't be saved.",
              {
                id: toastRef.current,
                duration: Infinity,
              },
            );
            return;
          }

          toast.dismiss(toastRef.current);
          await updateDraft(
            Branded.TemplateId(template.id),
            JSON.stringify(data),
            fontfamily,
          );
        }}
        value={getUpdatedMarkup()}
      >
        <div
          ref={containerRef}
          className={cn(
            "relative",
            // Block selection
            "[&_.slate-start-area-left]:!w-[64px] [&_.slate-start-area-right]:!w-[64px] [&_.slate-start-area-top]:!h-4",
          )}
        >
          <FixedToolbar>
            <FixedToolbarButtons />
          </FixedToolbar>

          <Editor
            className="px-20 py-16"
            autoFocus
            focusRing={false}
            variant="ghost"
          />

          <FloatingToolbar>
            <FloatingToolbarButtons />
          </FloatingToolbar>

          <MentionCombobox items={schemaKeys()} />

          <CommentsPopover />

          <CursorOverlay containerRef={containerRef} />
        </div>
      </Plate>
    </DndProvider>
  );
};

export default Playground;
