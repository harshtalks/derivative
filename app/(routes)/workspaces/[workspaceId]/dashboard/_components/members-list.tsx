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
import { Loader } from "lucide-react";
import { iife } from "@/lib/utils";

const MembersList = () => {
  const { workspaceId } = DashboardRoute.useParams();

  const searchTerm = useSelector(
    store,
    (state) => state.context.memberSearchTerm,
  );

  const query = clientApiTrpc.member.all.useQuery({
    workspaceId: Branded.WorkspaceId(workspaceId),
  });

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
