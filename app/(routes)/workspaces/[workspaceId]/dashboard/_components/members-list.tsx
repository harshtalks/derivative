import clientApiTrpc from "@/trpc/client";
import DashboardRoute from "../route.info";
import Branded from "@/types/branded.type";
import { ScrollArea } from "@/components/ui/scroll-area";
import { match } from "ts-pattern";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import store from "@/stores/manage-workspace-users";
import { useSelector } from "@xstate/store/react";
import useDebounce from "@/hooks/use-debounce";
import { Input } from "@/components/ui/input";
import { Edit3, Loader, MoreVertical } from "lucide-react";
import { iife } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import EditWorkspaceMember from "./edit-member-dialog";
import { useSessionProvider } from "@/providers/session.provider";

const MembersList = () => {
  const { workspaceId } = DashboardRoute.useParams();

  const searchTerm = useSelector(
    store,
    (state) => state.context.memberSearchTerm,
  );

  const query = clientApiTrpc.member.all.useQuery({
    workspaceId: Branded.WorkspaceId(workspaceId),
  });

  const trpcUtils = clientApiTrpc.useUtils();

  const deleteMutation = clientApiTrpc.member.remove.useMutation({
    onSuccess: () => {
      trpcUtils.member.all.invalidate();
    },
  });

  const { user } = useSessionProvider();

  return (
    <>
      <Input
        type="text"
        placeholder="Search members"
        value={searchTerm}
        onChange={(e) =>
          store.send({ type: "setMemberSearchTerm", value: e.target.value })
        }
        className="mb-4"
      />
      <ScrollArea className="h-[300px]">
        {match(query)
          .with({ status: "success" }, ({ data }) => (
            <div>
              {iife(() => {
                const filteredMembers = data.filter(
                  (member) =>
                    member.user.name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    member.user.email
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()),
                );

                return filteredMembers.length ? (
                  <div className="grid gap-4 pr-4">
                    {filteredMembers.map((member) => (
                      <div
                        key={member.id}
                        className="flex relative items-center justify-between space-x-4"
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            {member.user.avatar && (
                              <AvatarImage src={member.user.avatar} />
                            )}
                            <AvatarFallback>
                              {member.user.name
                                .split(" ")
                                .map((el) => el[0])
                                .slice(2)
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium leading-none">
                              {member.user.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {member.user.email}
                            </p>
                          </div>
                        </div>
                        {/* // Add  */}
                        <div className="flex items-center gap-1">
                          <EditWorkspaceMember member={member} />
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              disabled={deleteMutation.isPending}
                              asChild
                            >
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                              >
                                <MoreVertical className="h-3.5 w-3.5" />
                                <span className="sr-only">More</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                disabled={
                                  member.isCreator && member.userId === user?.id
                                }
                                onClick={async () => {
                                  toast.promise(
                                    deleteMutation.mutateAsync({
                                      memberId: Branded.MemberId(member.id),
                                      workspaceId:
                                        Branded.WorkspaceId(workspaceId),
                                    }),
                                    {
                                      loading: "Removing member...",
                                      success: () => {
                                        return `Member removed successfully`;
                                      },
                                      error: (error) => {
                                        return error.message;
                                      },
                                    },
                                  );
                                }}
                              >
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 flex items-center justify-center">
                    <p className="text-muted-foreground">
                      No members found with given word
                    </p>
                  </div>
                );
              })}
            </div>
          ))
          .with({ status: "pending" }, () => (
            <div className="py-12 flex items-center justify-center">
              <Loader className="shrink-0 size-4 animate-spin" />
            </div>
          ))
          .with({ status: "error" }, ({ error }) => <div>{error.message}</div>)
          .exhaustive()}
      </ScrollArea>
    </>
  );
};

export default MembersList;
