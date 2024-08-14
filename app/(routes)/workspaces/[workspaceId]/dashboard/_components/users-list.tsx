import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import clientApiTrpc from "@/trpc/client";
import { match } from "ts-pattern";
import { Loader } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const UsersList = () => {
  const query = clientApiTrpc.user.all.useQuery({});

  return match(query)
    .with({ status: "success" }, ({ data }) => (
      <ScrollArea className="h-[400px]">
        <div className="grid gap-4 pr-4">
          {data.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between space-x-4"
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
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <Select defaultValue="edit">
                <SelectTrigger className="ml-auto w-[110px]">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="edit">Can edit</SelectItem>
                  <SelectItem value="view">Can view</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </ScrollArea>
    ))
    .with({ status: "pending", isLoading: true }, () => (
      <div className="py-12 flex items-center justify-center">
        <p className="sr-only">Loading...</p>
        <Loader className="shrink-0 size-4 animate-spin" />
      </div>
    ))
    .with({ status: "error" }, ({ error }) => <div>{error.message}</div>)
    .exhaustive();
};

export default UsersList;
