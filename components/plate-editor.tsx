"use client";

import React, { useRef } from "react";

import { deepKeys } from "deeks";

import TemplatePageEditorRouteInfo from "@/app/(routes)/workspaces/[workspaceId]/templates/[templateId]/editor/route.info";
import clientApiTrpc from "@/trpc/client";
import { match } from "ts-pattern";
import { Loader } from "lucide-react";
import { Alert } from "./ui/alert";

import Markup from "./markup";
import Branded from "@/types/branded.type";

export default function PlateEditor() {
  const { templateId, workspaceId } = TemplatePageEditorRouteInfo.useParams();
  const query = clientApiTrpc.template.get.useQuery({
    templateId: Branded.TemplateId(templateId),
    workspaceId: Branded.WorkspaceId(workspaceId),
  });

  return match(query)
    .with({ status: "success" }, ({ data }) => {
      return <Markup template={data} />;
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
