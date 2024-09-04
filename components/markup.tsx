"use client";
import { fontStore } from "@/stores/font-store";
import { useSelector } from "@xstate/store/react";
import { Button } from "./ui/button";
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
import { getDraft, updateDraft } from "@/database/local-store";
import { CommentsProvider } from "@udecode/plate-comments";
import { cn } from "@udecode/cn";
import { commentsUsers, myUserId } from "@/lib/plate/comments";
import { plugins } from "@/lib/plate/plate-plugins";
import { useEffect, useRef, useState } from "react";
import { ELEMENT_PARAGRAPH } from "@udecode/plate-paragraph";
import { templates } from "@/database/schema";
import { TComboboxItem } from "@udecode/plate-combobox";
import { deepKeys } from "deeks";
import { queryOptions, useQuery, useQueryClient } from "@tanstack/react-query";
import { match } from "ts-pattern";
import { Loader2 } from "lucide-react";
import Branded from "@/types/branded.type";
import handlebars from "handlebars";

const templateMarkQuery = (
  templateId: Branded.TemplateId,
  fontFamily?: string,
) =>
  queryOptions({
    queryKey: ["templateMarkup", templateId],
    queryFn: async () => {
      return getDraft(templateId);
    },
  });

const Markup = ({ template }: { template: typeof templates.$inferSelect }) => {
  const fontfamily = useSelector(
    fontStore,
    (state) => state.context.editorFont,
  );

  const query = useQuery(templateMarkQuery(Branded.TemplateId(template.id)));

  const containerRef = useRef(null);

  const initialValue = [
    {
      id: "1",
      type: ELEMENT_PARAGRAPH,
      children: [{ text: "Hello, World!" }],
    },
  ];

  const schemaKeys = () => {
    try {
      const schema = JSON.parse(template.json);
      return deepKeys(schema).map((l, i) => ({
        label: l,
        text: `{{${l}}}`,
        key: i.toString(),
      }));
    } catch {
      return [];
    }
  };

  const queryClient = useQueryClient();

  const [html, setHtml] = useState<string>("");

  return (
    <div className="max-w-[1336px]">
      <div className="flex pb-2 gap-2 items-center justify-end">
        <Button
          onClick={async () => {
            await updateDraft(
              Branded.TemplateId(template.id),
              JSON.stringify(initialValue),
              fontfamily,
            ).then(() => {
              queryClient.resetQueries({
                queryKey: templateMarkQuery(Branded.TemplateId(template.id))
                  .queryKey,
                exact: true,
              });
            });
          }}
          className="text-xs"
          size="sm"
          variant="outline"
        >
          Reset to Default
        </Button>
        <Button className="text-xs" size="sm" variant="gooeyLeft">
          Save Markup
        </Button>
        {html && (
          <div
            dangerouslySetInnerHTML={{
              __html: html,
            }}
          />
        )}
      </div>
      <div className="border bg-background rounded-lg">
        {match(query)
          .with({ status: "success" }, ({ data }) => (
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
                initialValue={
                  data?.markup ? JSON.parse(data.markup) : initialValue
                }
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
          ))
          .with({ status: "pending" }, () => {
            return (
              <div className="py-12 flex items-center justify-center">
                <Loader2 className="shrink-0 size-4 animate-spin" />
              </div>
            );
          })
          .with({ status: "error" }, ({ error }) => {
            return (
              <div className="py-12 flex items-center justify-center">
                <p>{error.message}</p>
              </div>
            );
          })
          .exhaustive()}
      </div>
    </div>
  );
};

export default Markup;
