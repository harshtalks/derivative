"use client";
import { Button } from "@/components/ui/button";
import clientApiTrpc from "@/trpc/client";
import { useReducer } from "react";
import { toast } from "sonner";
import DashboardRoute from "../route.info";
import Branded from "@/types/branded.type";

const LeaveWorkspace = () => {
  const [hasClicked, setHasClicked] = useReducer((prev) => !prev, false);
  const { workspaceId } = DashboardRoute.useParams();
  const deleteMutation = clientApiTrpc.member.getRid.useMutation({
    onSuccess: async () => {
      window.location.reload();
    },
  });

  return (
    <div>
      <Button
        onClick={setHasClicked}
        size="sm"
        className="text-xs"
        variant="destructive"
      >
        Leave Workspace
      </Button>
      <p className="text-xs mt-2 text-muted-foreground leading-relaxed">
        This is a non-reversible action. You will lose access to this workspace
        and all its contents. If you are a creator of this workspace, the
        ownership will be transferred to another member. If there are no other
        members, the workspace will be deleted.
      </p>
      {hasClicked && (
        <div className="mt-4 flex items-center gap-2">
          <Button
            onClick={() => {
              toast.promise(
                deleteMutation.mutateAsync({
                  id: Branded.WorkspaceId(workspaceId),
                }),
                {
                  loading: "Leaving workspace...",
                  success: "You have left the workspace.",
                  error: (e) => e.message,
                },
              );
            }}
            size="sm"
            className="text-xs"
            variant="destructive"
          >
            Confirm
          </Button>
          <Button
            size="sm"
            className="text-xs"
            variant="ghost"
            onClick={setHasClicked}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};

export default LeaveWorkspace;
