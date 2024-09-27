import serverApiTrpc from "@/trpc/server";
import { SlashCmd, SlashCmdProvider } from "@harshtalks/slash-tiptap";
import { EditorContent } from "@tiptap/react";
import {
  InvoiceEditorContextProvider,
  useInvoiceEditorContext,
} from "../editor-context";
import { slashSuggestions } from "../suggestions";
import { BubbleMenuWrapper } from "./bubble-menu";
import editor from "./editor";
import ImageMenu from "./image-menu";
import SchemaVariables from "./schema-node";
import TopEditorOptions from "./top-editor-options";
import useInvoiceEditor from "../use-invoice-editor";
import { Button } from "@/components/ui/button";
import { LucideFolderSync } from "lucide-react";
import { queryOptions, useQuery } from "@tanstack/react-query";
import Branded from "@/types/branded.type";
import { getLocalMarkup } from "@/database/local-store";
import TemplatePageEditorRouteInfo from "@/app/(routes)/workspaces/[workspaceId]/templates/[templateId]/editor/route.info";
import { useTypedParams } from "tempeh";
import { Match } from "effect";
import Query from "@/components/query";

export const playgroundQueryOptions = ({
  templateId,
}: {
  templateId: Branded.TemplateId;
}) =>
  queryOptions({
    queryKey: ["template.get", templateId],
    queryFn: async () => getLocalMarkup(templateId),
  });

const Playground = ({
  data,
}: {
  data: Awaited<ReturnType<typeof serverApiTrpc.template.get>>;
}) => {
  const editor = useInvoiceEditorContext();
  const { templateId, workspaceId } = useTypedParams(
    TemplatePageEditorRouteInfo,
  );

  const query = useQuery(
    playgroundQueryOptions({
      templateId: Branded.TemplateId(templateId),
    }),
  );

  return (
    <div className="p-2 flex flex-col pb-24 gap-4 items-center justify-center overflow-y-auto w-full">
      <div className="flex gap-4 pb-8 items-center justify-end w-full">
        <div className="inline-flex items-center gap-1">
          <LucideFolderSync className="shrink-0 size-4" />
          <p className="text-sm text-muted-foreground">
            Editor is not synced with server
          </p>
        </div>
        <Button size="sm">Reset</Button>
        <Button size="sm">Save Markup</Button>
      </div>
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
        {Match.value(query).pipe(
          Match.when({ status: "success" }, ({ data }) => (
            <EditorContent
              style={{
                maxWidth: "21cm",
                minHeight: "29.7cm",
                maxHeight: "29.7cm",
                minWidth: "21cm",
              }}
              className="border p-12 bg-white rounded-md shadow-2xl"
              value="<p>hi {{invoice.invoiceNumber}} </p>"
              content="<p>hi {{invoice.invoiceNumber}} </p>"
              editor={editor}
            />
          )),
          Match.when({ status: "pending" }, () => <Query.Loading />),
          Match.when({ status: "error" }, ({ error }) => (
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
          )),
          Match.exhaustive,
        )}
      </div>
    </div>
  );
};

export default Playground;
