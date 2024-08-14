import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import clientApiTrpc from "@/trpc/client";
import { match } from "ts-pattern";
import { Loader } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import AddMemberToWorkspace from "./add-member-dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/use-debounce";

const UsersList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const search = useDebounce(searchTerm);

  const query = clientApiTrpc.user.all.useQuery(
    {
      query: search,
    },
    {
      enabled: !!search,
    },
  );

  return (
    <>
      <Input
        type="text"
        placeholder="Search users"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      {match(query)
        .with({ status: "success" }, ({ data }) => (
          <div>
            {data.length ? (
              <ScrollArea className="h-[400px]">
                <div className="grid gap-4 pr-4">
                  {data.map((user) => (
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
                      <AddMemberToWorkspace user={user} />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="py-12 flex items-center justify-center">
                <p className="text-muted-foreground">
                  No users found with given query
                </p>
              </div>
            )}
          </div>
        ))
        .with({ status: "pending" }, () => (
          <div className="py-12 flex items-center justify-center">
            {search ? (
              <Loader className="shrink-0 size-4 animate-spin" />
            ) : (
              <p className="text-muted-foreground">Search for users</p>
            )}
          </div>
        ))
        .with({ status: "error" }, ({ error }) => <div>{error.message}</div>)
        .exhaustive()}
    </>
  );
};

export default UsersList;
