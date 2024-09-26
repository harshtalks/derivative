"use client";

import { EditorContent } from "@tiptap/react";
import useInvoiceEditor from "../use-invoice-editor";
import { BubbleMenuWrapper } from "./bubble-menu";
import TopEditorOptions from "./top-editor-options";
import { useSelector } from "@xstate/store/react";
import imageStore from "../image-store";
import { InvoiceEditorContextProvider } from "../editor-context";
import { useEffect, useState } from "react";
import { SlashCmd, SlashCmdProvider } from "@harshtalks/slash-tiptap";
import { slashSuggestions } from "../suggestions";
import { ImageAligner } from "@harshtalks/image-tiptap";
import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import ImageMenu from "./image-menu";
import SchemaNode from "../dynamic-variables/components";
import SchemaVariables from "./schema-node";
import clientApiTrpc from "@/trpc/client";
import TemplatePageEditorRouteInfo from "@/app/(routes)/workspaces/[workspaceId]/templates/[templateId]/editor/route.info";
import Branded from "@/types/branded.type";
import { Match } from "effect";
import Query from "@/components/query";

const Editor = () => {
  const { editor } = useInvoiceEditor();
  const { url } = useSelector(imageStore, (state) => state.context);
  const { templateId, workspaceId } = TemplatePageEditorRouteInfo.useParams();
  const templateQuery = clientApiTrpc.template.get.useQuery({
    templateId: Branded.TemplateId(templateId),
    workspaceId: Branded.WorkspaceId(workspaceId),
  });

  if (!editor) {
    return null;
  }

  return Match.value(templateQuery).pipe(
    Match.when({ status: "success" }, ({ data }) => (
      <SlashCmdProvider>
        <SchemaNode.provider>
          <InvoiceEditorContextProvider editor={editor}>
            <div className="p-2 flex flex-col pb-24 gap-4 items-center justify-center overflow-y-auto w-full">
              <TopEditorOptions />
              <div>
                <BubbleMenuWrapper />
                <SchemaVariables json={data.json} />
                <ImageMenu />
                <SlashCmd.Root editor={editor}>
                  <SlashCmd.Cmd className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background p-4  shadow-[rgba(100,_100,_111,_0.2)_0px_7px_29px_0px] transition-all">
                    <SlashCmd.Empty>No results found</SlashCmd.Empty>
                    <SlashCmd.List>
                      {slashSuggestions.map((item) => (
                        <SlashCmd.Item
                          value={item.title}
                          onCommand={(val) => {
                            item.command(val);
                          }}
                          className="flex w-full items-center space-x-2 cursor-pointer rounded-md p-2 text-left text-sm hover:bg-accent aria-selected:bg-accent"
                          key={item.title}
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent">
                            {item.icon}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{item.title}</p>
                            <p className="text-[10px] text-muted-foreground">
                              {item.description}
                            </p>
                          </div>
                        </SlashCmd.Item>
                      ))}
                    </SlashCmd.List>
                  </SlashCmd.Cmd>
                </SlashCmd.Root>
                <EditorContent
                  style={{
                    maxWidth: "21cm",
                    minHeight: "29.7cm",
                    maxHeight: "29.7cm",
                    minWidth: "21cm",
                  }}
                  className="border p-12 bg-white rounded-md shadow-2xl"
                  editor={editor}
                />
              </div>
            </div>
          </InvoiceEditorContextProvider>
        </SchemaNode.provider>
      </SlashCmdProvider>
    )),
    Match.when({ status: "pending" }, () => {
      return <Query.Loading />;
    }),
    Match.when({ status: "error" }, ({ error }) => {
      return <Query.Error error={error.message} />;
    }),
    Match.exhaustive,
  );
};

export default Editor;
