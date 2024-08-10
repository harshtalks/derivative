import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import serverApiTrpc from "@/trpc/server";
import { Loader } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { brandedCurrentWorkspace } from "../../../route.info";

export const WorkspaceLogsLoading = () => {
  return (
    <Card x-chunk="dashboard-05-chunk-3">
      <CardHeader className="px-7">
        <CardTitle>Workspace Activities</CardTitle>
        <CardDescription>
          Recent activities for all things related to your workspaces.
        </CardDescription>
        <CardContent className="flex items-center justify-center py-16">
          <Loader className="animate-spin size-6 shrink-0" />
        </CardContent>
      </CardHeader>
    </Card>
  );
};

const WorkspaceLogs = async () => {
  const logs = await serverApiTrpc.log.read({
    workspaceId: brandedCurrentWorkspace(),
  });

  return (
    <Card x-chunk="dashboard-05-chunk-3">
      <CardHeader className="px-7">
        <CardTitle>Workspace Activities</CardTitle>
        <CardDescription>
          Recent activities for all things related to your workspaces.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {logs.length ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden sm:table-cell">Type</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div className="font-medium !capitalize">
                      {log.performedBy.user.name}
                    </div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      {log.performedBy.user.email}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {log.event}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge className="text-xs" variant="secondary">
                      Fulfilled
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {log.createdAt &&
                      formatDistanceToNow(log.createdAt * 1000, {
                        addSuffix: true,
                      })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="text-xs">
                      View More
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Alert className="w-fit mx-auto">No logs found</Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkspaceLogs;
