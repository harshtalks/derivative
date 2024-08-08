import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import clientApiTrpc from "@/trpc/client";
import DashboardRoute from "../route.info";
import Branded from "@/types/branded.type";
import { match } from "ts-pattern";
import { Loader } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { toast } from "sonner";
import WorkspaceInvitationRoute from "../../invitation/route.info";

const InviteMembers = () => {
  const { workspaceId } = DashboardRoute.useParams();
  const query = clientApiTrpc.workspace.meta.useQuery({
    workspaceId: Branded.WorkspaceId(workspaceId),
  });
  const utils = clientApiTrpc.useUtils();
  const mutation = clientApiTrpc.workspace.generateLink.useMutation({
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Invite link generated successfully");
      utils.workspace.meta.invalidate();
    },
  });

  return match(query)
    .with({ status: "pending" }, () => (
      <div className="flex items-stretch justify-center gap-2">
        <Loader className="shrink-0 size-4 animate-spin" />
      </div>
    ))
    .with({ status: "error" }, ({ error }) => {
      return (
        <div className="flex items-stretch gap-2">
          <Alert className="w-fit mx-auto">{error.message}</Alert>
        </div>
      );
    })
    .with({ status: "success" }, ({ data }) => {
      return data.inviteCode ? (
        <div className="flex items-stretch gap-2">
          <Input
            value={WorkspaceInvitationRoute(
              { workspaceId: Branded.WorkspaceId(workspaceId) },
              { search: { invite: data.inviteCode } },
            )}
            readOnly
          />
          <Button size="sm" className="shrink-0 text-xs">
            Copy Link
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground text-sm">
            No invite code generated yet
          </p>
          <Button
            onClick={() =>
              mutation.mutate({ workspaceId: Branded.WorkspaceId(workspaceId) })
            }
            disabled={mutation.isPending}
            size="sm"
            className="shrink-0 w-fit text-xs"
          >
            {mutation.isPending && (
              <Loader className="shrink-0 size-4 animate-spin" />
            )}
            {mutation.isPending ? "Generating..." : "Generate Invite Link"}
          </Button>
        </div>
      );
    })
    .exhaustive();
};

export default InviteMembers;
