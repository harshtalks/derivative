import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import clientApiTrpc from "@/trpc/client";
import DashboardRoute from "../route.info";
import Branded from "@/types/branded.type";
import { match } from "ts-pattern";
import { Loader } from "lucide-react";
import { Alert } from "@/components/ui/alert";

const InviteMembers = () => {
  const { workspaceId } = DashboardRoute.useParams();
  const query = clientApiTrpc.workspace.workspace.useQuery({
    workspaceId: Branded.WorkspaceId(workspaceId),
  });

  return match(query)
    .with({ status: "pending" }, () => (
      <div className="flex items-stretch gap-2">
        <Loader className="shrink-0 size-4 animate-spin" />
      </div>
    ))
    .with({ status: "error" }, ({ error }) => {
      <div className="flex items-stretch gap-2">
        <Alert className="w-fit mx-auto">{error.message}</Alert>
      </div>;
    })
    .with({ status: "success" }, ({ data }) => {
      <div className="flex items-stretch gap-2">
        <Input value="http://example.com/link/to/document" readOnly />
        <Button variant="ghost" className="shrink-0">
          Copy Link
        </Button>
      </div>;
    });
};

export default InviteMembers;
