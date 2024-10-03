"use client";

import TemplatePageEditorRouteInfo from "@/app/(routes)/workspaces/[workspaceId]/templates/[templateId]/editor/route.info";
import Query from "@/components/query";
import clientApiTrpc from "@/trpc/client";
import Branded from "@/types/branded.type";
import { SlashCmdProvider } from "@harshtalks/slash-tiptap";
import { useSelector } from "@xstate/store/react";
import { Match } from "effect";
import SchemaNode from "../dynamic-variables/components";
import { InvoiceEditorContextProvider } from "../editor-context";
import imageStore from "../image-store";
import useInvoiceEditor from "../use-invoice-editor";
import Playground from "./playground";

const Editor = () => {
  const { editor } = useInvoiceEditor();
  const { templateId, workspaceId } = TemplatePageEditorRouteInfo.useParams();
  const templateQuery = clientApiTrpc.template.get.useQuery(
    {
      templateId: Branded.TemplateId(templateId),
      workspaceId: Branded.WorkspaceId(workspaceId),
    },
    {
      refetchOnWindowFocus: false,
    },
  );

  if (!editor) {
    return null;
  }

  return Match.value(templateQuery).pipe(
    Match.when({ status: "success" }, ({ data }) => (
      <SlashCmdProvider>
        <SchemaNode.provider>
          <InvoiceEditorContextProvider editor={editor}>
            <Playground data={data} />
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
