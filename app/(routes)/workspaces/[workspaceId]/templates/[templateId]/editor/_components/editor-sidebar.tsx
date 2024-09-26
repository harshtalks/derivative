"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Edit } from "lucide-react";
import TemplatePageEditorRouteInfo from "../route.info";
import clientApiTrpc from "@/trpc/client";
import Branded from "@/types/branded.type";
import { Match } from "effect";

const SidebarContent = () => {
  const { templateId, workspaceId } = TemplatePageEditorRouteInfo.useParams();

  const query = clientApiTrpc.template.get.useQuery({
    templateId: Branded.TemplateId(templateId),
    workspaceId: Branded.WorkspaceId(workspaceId),
  });

  return Match.value(query).pipe(
    Match.when({ status: "error" }, ({ error }) => {
      return <div>{error.message}</div>;
    }),
    Match.when({ status: "pending" }, () => {
      return <div>Loading...</div>;
    }),
    Match.when({ status: "success" }, ({ data }) => {
      return (
        <div>
          <div>
            <h1 className="font-bold text-2xl">{data.name}</h1>
            <p>{data.description}</p>
          </div>
          <div className="py-12">
            <h2 className="pb-2">Sample JSON Schema</h2>
            <pre className="p-2 !font-mono bg-zinc-100 dark:bg-zinc-700 text-xs rounded-md">
              {data.json}
            </pre>
          </div>
        </div>
      );
    }),
    Match.exhaustive,
  );
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
