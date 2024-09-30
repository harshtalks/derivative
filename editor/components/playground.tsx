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
import { Loader, LucideFolderSync } from "lucide-react";
import { queryOptions, useQuery, useQueryClient } from "@tanstack/react-query";
import Branded from "@/types/branded.type";
import { getLocalMarkup, saveLocalMarkup } from "@/database/local-store";
import TemplatePageEditorRouteInfo from "@/app/(routes)/workspaces/[workspaceId]/templates/[templateId]/editor/route.info";
import { useTypedParams } from "tempeh";
import { Effect, Match } from "effect";
import Query from "@/components/query";
import { useEffect } from "react";
import Content from "./content";
import TableMenu from "./table-menu";
import clientApiTrpc from "@/trpc/client";
import { toast } from "sonner";
import { useSelector } from "@xstate/store/react";
import { fontStore } from "@/stores/font-store";
import { cn } from "@/lib/utils";

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
  const { templateId, workspaceId } = useTypedParams(
    TemplatePageEditorRouteInfo,
  );
  const editor = useInvoiceEditorContext();
  const query = useQuery(
    playgroundQueryOptions({
      templateId: Branded.TemplateId(templateId),
    }),
  );

  const queryClient = useQueryClient();

  // Mutation
  const mutation = clientApiTrpc.markup.add.useMutation({
    onSettled: () => {
      queryClient.resetQueries({
        queryKey: playgroundQueryOptions({
          templateId: Branded.TemplateId(templateId),
        }).queryKey,
      });
    },
  });

  const font = useSelector(fontStore, (state) => state.context.editorFont);

  return (
    <div className="p-2 flex flex-col pb-24 gap-4 items-center justify-center overflow-y-auto w-full">
      <div className="flex gap-4 pb-8 items-center justify-end w-full">
        {Match.value(data).pipe(
          Match.when(
            { template_markup: (template_markup) => !!template_markup },
            ({ template_markup: { markup } }) => (
              <Button
                size="sm"
                onClick={async () => {
                  await saveLocalMarkup({
                    templateId: Branded.TemplateId(templateId),
                    markup: markup,
                  });
                  queryClient.resetQueries({
                    queryKey: playgroundQueryOptions({
                      templateId: Branded.TemplateId(templateId),
                    }).queryKey,
                  });
                }}
                variant="secondary"
              >
                Reset to server markup
              </Button>
            ),
          ),
          Match.orElse(() => null),
        )}
        <Button
          size="sm"
          onClick={async () => {
            await saveLocalMarkup({
              templateId: Branded.TemplateId(templateId),
              markup: "",
            });
            queryClient.resetQueries({
              queryKey: playgroundQueryOptions({
                templateId: Branded.TemplateId(templateId),
              }).queryKey,
            });
          }}
          variant="destructive"
        >
          Reset
        </Button>
        <Button
          size="sm"
          onClick={async () => {
            const markup = editor.getHTML();
            toast.promise(
              data.template_markup
                ? mutation.mutateAsync({
                    id: data.template_markup.id,
                    fontFamily: data.template_markup.fontFamily,
                    templateId: templateId,
                    markup: markup,
                    workspaceId: workspaceId,
                    updatedAt: Date.now(),
                  })
                : mutation.mutateAsync({
                    fontFamily: font,
                    templateId: templateId,
                    markup: markup,
                    workspaceId: workspaceId,
                  }),
              {
                success: "Markup saved successfully",
                error: "Failed to save markup",
                loading: "Saving markup...",
              },
            );
          }}
          disabled={mutation.isPending}
          className="inline-flex items-center"
        >
          {mutation.isPending && (
            <Loader className="size-4 shrink-0 animate-spin mr-2" />
          )}
          Save Markup
        </Button>
      </div>
      <TopEditorOptions />
      <div>
        <BubbleMenuWrapper />
        <TableMenu />
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
          Match.when({ status: "success" }, ({ data: localData }) => {
            return Effect.void.pipe(
              Effect.andThen(() => {
                const latestUpdated =
                  (data.template_markup?.updatedAt || 0) > localData.lastUpdated
                    ? data.template_markup?.markup
                    : localData.markup;

                return latestUpdated;
              }),
              Effect.andThen((markup) => {
                return <Content value={markup || ""} />;
              }),
              Effect.runSync,
            );
          }),
          Match.when({ status: "pending" }, () => <Query.Loading />),
          Match.when({ status: "error" }, () => (
            <Content value={data.template_markup?.markup || ""} />
          )),
          Match.exhaustive,
        )}
      </div>
    </div>
  );
};

export default Playground;
