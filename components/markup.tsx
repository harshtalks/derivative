"use client";
import { fontStore } from "@/stores/font-store";
import { useSelector } from "@xstate/store/react";
import { Button } from "./ui/button";

import { getDraft, updateDraft } from "@/database/local-store";

import { ELEMENT_PARAGRAPH } from "@udecode/plate-paragraph";
import { templates } from "@/database/schema";
import { queryOptions, useQuery, useQueryClient } from "@tanstack/react-query";
import { match } from "ts-pattern";
import { Loader2 } from "lucide-react";
import Branded from "@/types/branded.type";
import clientApiTrpc from "@/trpc/client";
import { toast } from "sonner";
import InvoiceEditor from "./invoice-editor";

export const templateMarkQuery = (templateId: Branded.TemplateId) =>
  queryOptions({
    queryKey: ["templateMarkup", templateId],
    queryFn: async () => {
      return await getDraft(templateId);
    },
  });

export const initialValue = [
  {
    id: "1",
    type: ELEMENT_PARAGRAPH,
    children: [{ text: "Hello, World!" }],
  },
];

const Markup = ({ template }: { template: typeof templates.$inferSelect }) => {
  const fontfamily = useSelector(
    fontStore,
    (state) => state.context.editorFont,
  );

  const markupQuery = clientApiTrpc.markup.get.useQuery({
    templateId: Branded.TemplateId(template.id),
  });

  const queryClient = useQueryClient();

  const mutation = clientApiTrpc.markup.add.useMutation();

  const mutationAsync = async () => {
    const data = await getDraft(Branded.TemplateId(template.id));
    const output = await mutation.mutateAsync({
      fontFamily: fontfamily,
      markup: data ? data.markup : JSON.stringify(initialValue),
      templateId: template.id,
      workspaceId: template.workspaceId,
    });

    return output;
  };

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
        <Button
          onClick={async () => {
            toast.promise(mutationAsync, {
              loading: "Please wait while the markup is being saved...",
              success: "Your markup has been saved successfully!",
              error: (err) => err.message,
            });
          }}
          className="text-xs"
          size="sm"
          variant="gooeyLeft"
        >
          Save Markup
        </Button>
      </div>
      <div className="border bg-background rounded-lg">
        {match(markupQuery)
          .with({ status: "success" }, ({ data }) => (
            <InvoiceEditor markup={data} template={template} />
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
