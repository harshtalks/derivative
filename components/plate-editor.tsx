"use client";

import React, { useRef } from "react";
import { cn } from "@udecode/cn";
import { CommentsProvider } from "@udecode/plate-comments";
import { Plate } from "@udecode/plate-common";
import { ELEMENT_PARAGRAPH } from "@udecode/plate-paragraph";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { deepKeys } from "deeks";

import { commentsUsers, myUserId } from "@/lib/plate/comments";
import { plugins } from "@/lib/plate/plate-plugins";
import { CommentsPopover } from "@/components/plate-ui/comments-popover";
import { CursorOverlay } from "@/components/plate-ui/cursor-overlay";
import { Editor } from "@/components/plate-ui/editor";
import { FixedToolbar } from "@/components/plate-ui/fixed-toolbar";
import { FixedToolbarButtons } from "@/components/plate-ui/fixed-toolbar-buttons";
import { FloatingToolbar } from "@/components/plate-ui/floating-toolbar";
import { FloatingToolbarButtons } from "@/components/plate-ui/floating-toolbar-buttons";
import { MentionCombobox } from "@/components/plate-ui/mention-combobox";
import TemplatePageEditorRouteInfo from "@/app/(routes)/workspaces/[workspaceId]/templates/[templateId]/editor/route.info";
import clientApiTrpc from "@/trpc/client";
import Branded from "@/types/branded.type";
import { match } from "ts-pattern";
import { TComboboxItem } from "@udecode/plate-combobox";
import { Loader } from "lucide-react";
import { Alert } from "./ui/alert";

export default function PlateEditor() {
  const containerRef = useRef(null);

  const { templateId, workspaceId } = TemplatePageEditorRouteInfo.useParams();
  const query = clientApiTrpc.template.get.useQuery({
    templateId: Branded.TemplateId(templateId),
    workspaceId: Branded.WorkspaceId(workspaceId),
  });

  const initialValue = [
    {
      id: "1",
      type: ELEMENT_PARAGRAPH,
      children: [{ text: "Hello, World!" }],
    },
  ];

  return match(query)
    .with({ status: "success" }, ({ data }) => {
      const schemaKeys = () => {
        try {
          const schema = JSON.parse(data.json);
          return deepKeys(schema).map((l, i) => ({ text: l }) as TComboboxItem);
        } catch {
          return [];
        }
      };
      return (
        <DndProvider backend={HTML5Backend}>
          <CommentsProvider users={commentsUsers} myUserId={myUserId}>
            <Plate plugins={plugins} initialValue={initialValue}>
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
          </CommentsProvider>
        </DndProvider>
      );
    })
    .with({ status: "pending" }, () => {
      return (
        <div className="py-24 flex items-center justify-center">
          <Loader className="animate-spin size-4 shrink-0" />
        </div>
      );
    })
    .with({ status: "error" }, ({ error }) => {
      return (
        <div className="py-24 flex items-center justify-center">
          <Alert variant="destructive">{error.message}</Alert>
        </div>
      );
    })
    .exhaustive();
}
