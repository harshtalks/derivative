import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import clientApiTrpc from "@/trpc/client";
import DashboardRoute from "../route.info";
import Branded from "@/types/branded.type";
import { AlertOctagon, Check, Copy, Loader } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import WorkspaceInvitationRoute from "../../invitation/route.info";
import { useEffect, useReducer } from "react";
import { Match } from "effect";

const InviteMembers = () => {
  const { workspaceId } = DashboardRoute.useParams();
  const query = clientApiTrpc.workspace.meta.useQuery(
    {
      workspaceId: Branded.WorkspaceId(workspaceId),
    },
    { retry: 0 },
  );
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

  const [copied, setCopied] = useReducer((prev) => !prev, false);

  return Match.value(query).pipe(
    Match.when({ status: "success" }, ({ data }) => {
      return Match.value(data).pipe(
        Match.when({ inviteCode: (code) => !!code }, (data) => (
          <div className="flex items-stretch gap-2">
            <Input
              value={WorkspaceInvitationRoute(
                { workspaceId: Branded.WorkspaceId(workspaceId) },
                { search: { invite: data.inviteCode } },
              )}
              readOnly
              className="text-muted-foreground text-xs shadow-none"
            />
            <Button
              color=""
              onClick={() => {
                if (!data.inviteCode) {
                  return;
                }
                navigator.clipboard.writeText(
                  WorkspaceInvitationRoute(
                    { workspaceId: Branded.WorkspaceId(workspaceId) },
                    { search: { invite: data.inviteCode } },
                  ),
                );

                toast.success("Link copied to clipboard");
                setCopied();

                setTimeout(() => {
                  setCopied();
                }, 2000);
              }}
              size="sm"
              className="shrink-0 text-xs"
            >
              {copied ? (
                <span className="inline-flex items-center">
                  <Check className="shrink-0 size-4 mr-1" />
                  Link Copied
                </span>
              ) : (
                <span className="inline-flex items-center">
                  <Copy className="shrink-0 size-4 mr-1" />
                  Copy Link
                </span>
              )}
            </Button>
          </div>
        )),
        Match.orElse((data) => (
          <div className="flex flex-col gap-2">
            <p className="text-muted-foreground text-sm">
              No invite code generated yet
            </p>
            <Button
              onClick={() =>
                mutation.mutate({
                  workspaceId: Branded.WorkspaceId(workspaceId),
                })
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
        )),
      );
    }),
    Match.when({ status: "pending" }, () => (
      <div className="flex items-stretch justify-center gap-2">
        <Loader className="shrink-0 size-4 animate-spin" />
      </div>
    )),
    Match.when({ status: "error" }, ({ error }) => {
      return (
        <div className="flex items-stretch gap-2">
          <Alert className="w-fit mx-auto mb-1">
            <AlertTitle className="flex items-center gap-1">
              <AlertOctagon className="shrink-0 size-4" />
              <span>Error</span>
            </AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        </div>
      );
    }),
    Match.exhaustive,
  );
};

export default InviteMembers;
