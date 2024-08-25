"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Edit } from "lucide-react";
import TemplatePageEditorRouteInfo from "../route.info";
import clientApiTrpc from "@/trpc/client";
import { match } from "ts-pattern";
import Branded from "@/types/branded.type";
import TemplateSchemaEditor from "../../../new-template/_components/template-schema-editor";

const SidebarContent = () => {
  const { templateId, workspaceId } = TemplatePageEditorRouteInfo.useParams();

  const query = clientApiTrpc.template.get.useQuery({
    templateId: Branded.TemplateId(templateId),
    workspaceId: Branded.WorkspaceId(workspaceId),
  });

  return match(query)
    .with({ status: "error" }, ({ error }) => {
      return <div>{error.message}</div>;
    })
    .with({ status: "pending" }, () => {
      return <div>Loading...</div>;
    })
    .with({ status: "success" }, ({ data }) => {
      return (
        <div>
          <div>
            <h1 className="font-bold text-2xl">{data.name}</h1>
            <p>{data.description}</p>
          </div>
          <div className="py-12">
            <TemplateSchemaEditor value={data.jsonSchema} />
          </div>
        </div>
      );
    })
    .exhaustive();
};

const EditorSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="sm">
          Open Sidebar <Edit className="shrink-0 ml-2 size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="min-w-[50vw]">
        <SidebarContent />
      </SheetContent>
    </Sheet>
  );
};

export default EditorSidebar;
