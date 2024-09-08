import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Plate, createPlateEditor } from "@udecode/plate-common";
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
import { useRef } from "react";
import { templateMarkups, templates } from "@/database/schema";
import Branded from "@/types/branded.type";
import { updateDraft } from "@/database/local-store";
import { initialValue, templateMarkQuery } from "./markup";
import { useSelector } from "@xstate/store/react";
import { fontStore } from "@/stores/font-store";
import { useQuery } from "@tanstack/react-query";
import { match } from "ts-pattern";
import { deepKeys } from "deeks";
import { Loader2 } from "lucide-react";

export const getSchemaKeys = (str: string) => {
  try {
    const schema = JSON.parse(str);
    return deepKeys(schema).map((l, i) => ({
      label: l,
      text: `{{${l}}}`,
      key: i.toString(),
    }));
  } catch {
    return [];
  }
};

const InvoiceEditor = ({
  template,
  markup,
}: {
  template: typeof templates.$inferSelect;
  markup: typeof templateMarkups.$inferSelect | null;
}) => {
  const fontfamily = useSelector(
    fontStore,
    (state) => state.context.editorFont,
  );

  const query = useQuery(templateMarkQuery(Branded.TemplateId(template.id)));

  const containerRef = useRef(null);

  const schemaKeys = () => getSchemaKeys(template.json);

  return match(query)
    .with({ status: "success" }, ({ data }) => {
      const getUpdatedMarkup = () => {
        const localMarkup = data ? JSON.parse(data.markup) : null;
        const remoteMarkup = markup ? JSON.parse(markup.markup) : null;

        if (localMarkup && remoteMarkup) {
          const localLastUpdated =
            data?.lastUpdated && new Date(data.lastUpdated);
          const remoteLastUpdated =
            markup?.updatedAt && new Date(markup.updatedAt);

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

      return (
        <DndProvider backend={HTML5Backend}>
          <Plate
            plugins={plugins}
            onChange={async (data) => {
              await updateDraft(
                Branded.TemplateId(template.id),
                JSON.stringify(data),
                fontfamily,
              );
            }}
            initialValue={getUpdatedMarkup()}
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
    })
    .with({ status: "pending" }, () => {
      return (
        <div className="py-12 flex items-center justify-center">
          <Loader2 className="shrink-0 size-4 animate-spin" />
        </div>
      );
    })
    .with({ status: "error" }, ({ error }) => (
      <div className="py-12 flex items-center justify-center">
        <p>{error.message}</p>
      </div>
    ))
    .exhaustive();
};

export default InvoiceEditor;
