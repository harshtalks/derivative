import {
  CalendarPlus,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  File,
  ListFilter,
  Loader,
  MoreVertical,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import serverApiTrpc from "@/trpc/server";
import { formatDistanceToNow } from "date-fns";
import { Suspense } from "react";
import NewTemplateRouteInfo from "../../templates/new-template/route.info";
import AddMembers from "./add-members";
import WorkspaceRouteInfo, {
  brandedCurrentWorkspace,
} from "../../../route.info";
import { canAddMembers } from "@/auth/access-check";
import TemplatePageRouteInfo from "../../templates/[templateId]/route.info";
import templatesPageRoute from "../../templates/route.info";
import MemberDetails from "./member-details";
import LeaveWorkspace from "./leave-workspace";
import { Effect } from "effect";
import { redirect } from "next/navigation";

export async function DashboardLayout() {
  const workspaceId = brandedCurrentWorkspace();

  const { workspaceDB: workspace, creator } = await Effect.tryPromise({
    try: async () => {
      const output = await serverApiTrpc.workspace.workspace({
        workspaceId,
      });
      if (!output) {
        throw new Error("Workspace not found");
      }
      return output;
    },
    catch: (error) => {
      redirect(WorkspaceRouteInfo.navigate({}));
    },
  }).pipe(Effect.runPromise);

  const hasPermissionToAddMembers = await canAddMembers(workspaceId);

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
            <CardHeader className="pb-3">
              <CardTitle>Create Templates</CardTitle>
              <CardDescription className="max-w-lg text-balance leading-relaxed">
                Create templates for your invoices.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex items-center gap-4">
              <NewTemplateRouteInfo.Link params={{ workspaceId: workspaceId }}>
                <Button variant="ringHover" size="sm">
                  Create New Template
                </Button>
              </NewTemplateRouteInfo.Link>
              <templatesPageRoute.Link params={{ workspaceId: workspaceId }}>
                <Button variant="outline" size="sm">
                  View All Templates
                </Button>
              </templatesPageRoute.Link>
            </CardFooter>
          </Card>
          <Card x-chunk="dashboard-05-chunk-1">
            <CardHeader className="pb-2">
              <CardDescription>This Week</CardDescription>
              <CardTitle className="text-4xl">$1,329</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                +25% from last week
              </div>
            </CardContent>
            <CardFooter>
              <Progress value={25} aria-label="25% increase" />
            </CardFooter>
          </Card>
          <Card x-chunk="dashboard-05-chunk-2">
            <CardHeader className="pb-2">
              <CardDescription>This Month</CardDescription>
              <CardTitle className="text-4xl">$5,329</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                +10% from last month
              </div>
            </CardContent>
            <CardFooter>
              <Progress value={12} aria-label="12% increase" />
            </CardFooter>
          </Card>
        </div>
      </div>
      <div>
        <Card
          className="overflow-hidden shadow-none "
          x-chunk="dashboard-05-chunk-4"
        >
          <CardHeader className="flex flex-row justify-between flex-wrap items-start gap-2 bg-muted/50">
            <div className="grid gap-0.5">
              <CardTitle className="flex items-center gap-2 text-lg">
                {workspace.name}
              </CardTitle>
              {workspace.createdAt && (
                <CardDescription className="inline-flex items-center gap-1">
                  <CalendarPlus className="h-3.5 w-3.5" />
                  {formatDistanceToNow(workspace.createdAt, {
                    addSuffix: true,
                  })}
                </CardDescription>
              )}
            </div>
            <div className="flex items-center gap-1">
              {hasPermissionToAddMembers && <AddMembers />}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="outline" className="h-8 w-8">
                    <MoreVertical className="h-3.5 w-3.5" />
                    <span className="sr-only">More</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Export</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Trash</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="p-6 text-sm">
            <div className="grid gap-3">
              <div className="font-semibold">Workspace Details</div>
              <p className="text-sm leading-relaxed">{workspace.description}</p>
              {workspace.note && (
                <p className="text-sm leading-relaxed">
                  <strong>Note</strong>: {workspace.note}
                </p>
              )}
            </div>
            <Separator className="my-4" />
            <Suspense
              fallback={
                <div className="flex items-center justify-center py-12">
                  <Loader className="shrink-0 animate-spin size-4" />
                </div>
              }
            >
              <MemberDetails />
            </Suspense>
            <Separator className="my-4" />
            <div className="grid gap-3">
              <div className="font-semibold flex items-center gap-1">
                {/* {creator.avatar && (
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={creator.avatar} />
                  </Avatar>
                )} */}
                <span>Owner Information</span>
              </div>
              <dl className="grid gap-3">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground ">Name</dt>
                  <dd className="uppercase">{creator.name}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Email</dt>
                  <dd>
                    <a href="mailto:">{creator.email}</a>
                  </dd>
                </div>
                {creator.createdAt && (
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Joined</dt>
                    <dd>
                      {formatDistanceToNow(creator.createdAt, {
                        addSuffix: true,
                      })}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
            <Separator className="my-4" />
            <div className="grid gap-3">
              <div className="font-semibold">Workspace Actions</div>
              <LeaveWorkspace />
            </div>
          </CardContent>
          <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
            <div className="text-xs text-muted-foreground">
              Navigate across multiple workspaces.
            </div>
            <Pagination className="ml-auto mr-0 w-auto">
              <PaginationContent>
                <PaginationItem>
                  <Button size="icon" variant="outline" className="h-6 w-6">
                    <ChevronLeft className="h-3.5 w-3.5" />
                    <span className="sr-only">Previous Order</span>
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <Button size="icon" variant="outline" className="h-6 w-6">
                    <ChevronRight className="h-3.5 w-3.5" />
                    <span className="sr-only">Next Order</span>
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}

export default DashboardLayout;
