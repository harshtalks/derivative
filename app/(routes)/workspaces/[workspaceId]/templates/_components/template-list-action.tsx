"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import clientApiTrpc from "@/trpc/client";
import Branded from "@/types/branded.type";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import templatesPageRoute from "../route.info";
import { useRouter } from "next/navigation";
import NewTemplateRouteInfo from "../new-template/route.info";

const TemplateActionList = ({
  templateId,
}: {
  templateId: Branded.TemplateId;
}) => {
  const { refresh } = useRouter();
  const workspaceId = templatesPageRoute.useParams().workspaceId;
  const mutation = clientApiTrpc.template.delete.useMutation({
    onSuccess: () => {
      refresh();
    },
  });
  const { push: pushToEditTemplate } =
    NewTemplateRouteInfo.useRouter(useRouter);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-haspopup="true" size="icon" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => {
            pushToEditTemplate({
              params: {
                workspaceId: workspaceId,
              },
              searchParams: {
                templateId: templateId,
              },
            });
          }}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            toast.promise(
              mutation.mutateAsync({
                templateId: templateId,
                workspaceId: workspaceId,
              }),
              {
                loading: "Deleting template...",
                success: "Template deleted successfully!",
                error: (err) => err.message ?? "Failed to delete template",
              },
            );
          }}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TemplateActionList;
