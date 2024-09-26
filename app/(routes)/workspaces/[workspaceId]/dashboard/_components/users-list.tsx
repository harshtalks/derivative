import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import clientApiTrpc from "@/trpc/client";
import { Loader } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import useDebounce from "@/hooks/use-debounce";
import { useSelector } from "@xstate/store/react";
import store from "@/stores/manage-workspace-users";
import { Button } from "@/components/ui/button";
import { keepPreviousData } from "@tanstack/react-query";
import DashboardRoute from "../route.info";
import Branded from "@/types/branded.type";
import { iife } from "@/lib/utils";
import AddMemberToWorkspace from "./add-member-dialog";
import { Match } from "effect";

const UsersList = () => {
  const { userSearchTerm } = useSelector(store, (state) => state.context);
  const search = useDebounce(userSearchTerm);
  const { workspaceId } = DashboardRoute.useParams();

  const query = clientApiTrpc.user.all.useInfiniteQuery(
    {
      query: search,
      workspaceId: Branded.WorkspaceId(workspaceId),
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextToken,
      enabled: !!search,
    },
  );

  return (
    <>
      <ScrollArea className="h-[300px]">
        {Match.value(query).pipe(
          Match.when({ status: "success" }, ({ data }) => {
            return (
              <div>
                {iife(() => {
                  const users = data.pages.flatMap((page) => page.users);
                  return users.length ? (
                    <div className="grid gap-4 pr-4">
                      {users.map((user) => (
                        <div
                          key={user.id}
                          className="flex relative items-center justify-between space-x-4"
                        >
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              {user.avatar && <AvatarImage src={user.avatar} />}
                              <AvatarFallback>
                                {user.name
                                  .split(" ")
                                  .map((el) => el[0])
                                  .slice(2)
                                  .join("")
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium leading-none">
                                {user.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {user.email}
                              </p>
                            </div>
                          </div>
                          <div>
                            <AddMemberToWorkspace user={user} />
                          </div>
                        </div>
                      ))}
                      {query.hasNextPage && (
                        <div className="flex justify-center">
                          <Button
                            variant="outline"
                            size="sm"
                            className="inline-flex items-center gap-2"
                            onClick={() => query.fetchNextPage()}
                          >
                            {query.isFetchingNextPage && (
                              <Loader className="shrink-0 size-3 animate-spin" />
                            )}{" "}
                            Load more
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-12 flex items-center justify-center">
                      <p className="text-muted-foreground">
                        No users found with given query
                      </p>
                    </div>
                  );
                })}
              </div>
            );
          }),
          Match.when({ status: "pending" }, () => (
            <div className="py-12 flex items-center justify-center">
              {search ? (
                <Loader className="shrink-0 size-4 animate-spin" />
              ) : (
                <p className="text-muted-foreground">Search for users</p>
              )}
            </div>
          )),
          Match.when({ status: "error" }, ({ error }) => (
            <div className="py-12 flex items-center justify-center">
              <p className="text-muted-foreground">
                An error occurred while fetching users
              </p>
            </div>
          )),
          Match.exhaustive,
        )}
      </ScrollArea>
    </>
  );
};

export default UsersList;
