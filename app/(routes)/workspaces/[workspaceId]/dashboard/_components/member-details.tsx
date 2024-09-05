import serverApiTrpc from "@/trpc/server";
import { brandedCurrentWorkspace } from "../../../route.info";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import permissionsUIList from "../_data/permission-ui-list";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MemberDetails = async () => {
  const member = await serverApiTrpc.member.get({
    id: brandedCurrentWorkspace(),
  });

  return member ? (
    <div className="grid gap-3">
      <div className="font-semibold">Membership Information</div>
      <div className="grid gap-2 not-italic text-muted-foreground">
        {member.createdAt && (
          <span>
            Joined{" "}
            {formatDistanceToNow(member.createdAt * 1000, {
              addSuffix: true,
            })}
          </span>
        )}
        <div className="flex items-center gap-2 flex-wrap">
          {member.isCreator ? (
            <Badge className="w-fit">Creator</Badge>
          ) : (
            <Badge className="w-fit">Member</Badge>
          )}
          <Badge className="w-fit capitalize" variant="secondary">
            {member.role}
          </Badge>
        </div>
        <div className="space-y-4">
          {permissionsUIList.map((permission) => {
            return (
              <div
                className={cn(
                  "flex items-center",
                  member.permissions.includes(permission.value)
                    ? "opacity-100"
                    : "opacity-50",
                )}
                key={permission.value}
              >
                <permission.icon className="size-4 mr-2" />
                <div className="flex flex-col">
                  <p className="text-sm font-semibold">{permission.label}</p>
                  <span className="text-xs">{permission.description}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  ) : null;
};

export default MemberDetails;
