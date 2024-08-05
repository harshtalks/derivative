import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { workspaceStatus } from "@/database/schema";
import { cn } from "@/lib/utils";
import serverApiTrpc from "@/trpc/server";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { formatDistanceToNow } from "date-fns";
import React from "react";
import WorkspaceList from "./workspace-list";

const Workspaces = async () => {
  const workspaces = await serverApiTrpc.workspace.myWorkspaces();

  return workspaces.length ? (
    <WorkspaceList workspaceList={workspaces} />
  ) : (
    <div className="mt-10 flex max-w-[500px] mx-auto justify-center items-center gap-x-1 sm:gap-x-3">
      <Alert variant="default">
        <ExclamationTriangleIcon />
        <AlertDescription>
          We could not find any workspaces for you. Create a workspace to get
          started.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default Workspaces;
