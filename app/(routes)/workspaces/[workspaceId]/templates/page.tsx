import Image from "next/image";
import { File, ListFilter, MoreHorizontal, PlusCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuthInterceptor from "@/auth/authIntercepter";
import { checkAccessForWorkspace } from "@/auth/access-check";
import templatesPageRoute from "./route.info";
import { brandedCurrentWorkspace, setCurrentWorkspace } from "../../route.info";
import Branded from "@/types/branded.type";
import serverApiTrpc from "@/trpc/server";
import { formatDistanceToNow } from "date-fns";
import NewTemplateRouteInfo from "./new-template/route.info";
import ParserLayout from "@/components/parser-layout";
import TemplatePageRouteInfo from "./[templateId]/route.info";

export default async function Page({
  params,
  searchParams,
}: {
  params: unknown;
  searchParams: unknown;
}) {
  return (
    <ParserLayout
      routeInfo={templatesPageRoute}
      params={params}
      searchParams={searchParams}
    >
      {async ({ params, searchParams }) => {
        setCurrentWorkspace(Branded.WorkspaceId(params.workspaceId));

        await new AuthInterceptor(
          templatesPageRoute({
            workspaceId: brandedCurrentWorkspace(),
          }),
        )
          .withTwoFactor()
          .withRedirect()
          .withAfterAuth(checkAccessForWorkspace)
          .check();

        // get the data
        const { templates, count, endTo, startingFrom } =
          await serverApiTrpc.template.all({
            workspaceId: brandedCurrentWorkspace(),
            page: searchParams.page,
          });

        return (
          <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <div className="flex flex-col sm:gap-4 sm:py-4">
              <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                <Tabs defaultValue="all">
                  <div className="flex items-center">
                    <TabsList>
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="active">Active</TabsTrigger>
                      <TabsTrigger value="draft">Draft</TabsTrigger>
                      <TabsTrigger value="archived" className="hidden sm:flex">
                        Archived
                      </TabsTrigger>
                    </TabsList>
                    <div className="ml-auto flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 gap-1"
                          >
                            <ListFilter className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                              Filter
                            </span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuCheckboxItem checked>
                            Active
                          </DropdownMenuCheckboxItem>
                          <DropdownMenuCheckboxItem>
                            Draft
                          </DropdownMenuCheckboxItem>
                          <DropdownMenuCheckboxItem>
                            Archived
                          </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button size="sm" variant="outline" className="h-8 gap-1">
                        <File className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                          Export
                        </span>
                      </Button>
                      <NewTemplateRouteInfo.Link
                        params={{ workspaceId: brandedCurrentWorkspace() }}
                      >
                        <Button size="sm" className="h-8 gap-1">
                          <PlusCircle className="h-3.5 w-3.5" />
                          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Add Template
                          </span>
                        </Button>
                      </NewTemplateRouteInfo.Link>
                    </div>
                  </div>
                  <TabsContent value="all">
                    <Card x-chunk="dashboard-06-chunk-0">
                      <CardHeader>
                        <CardTitle>Templates</CardTitle>
                        <CardDescription>
                          Manage all your templates here
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="hidden md:table-cell">
                                Price
                              </TableHead>
                              <TableHead className="hidden md:table-cell">
                                Total Sales
                              </TableHead>
                              <TableHead className="hidden md:table-cell">
                                Created at
                              </TableHead>
                              <TableHead>
                                <span className="sr-only">View</span>
                              </TableHead>
                              <TableHead>
                                <span className="sr-only">Actions</span>
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {templates.map((template) => (
                              <TableRow key={template.id}>
                                <TableCell className="font-medium capitalize">
                                  {template.name}
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className="capitalize"
                                  >
                                    {template.status}
                                  </Badge>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  $499.99
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  25
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  {template.createdAt &&
                                    formatDistanceToNow(
                                      template.createdAt * 1000,
                                      {
                                        addSuffix: true,
                                      },
                                    )}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  <TemplatePageRouteInfo.Link
                                    params={{
                                      templateId: template.id,
                                      workspaceId: brandedCurrentWorkspace(),
                                    }}
                                  >
                                    <Button size="sm">View</Button>
                                  </TemplatePageRouteInfo.Link>
                                </TableCell>
                                <TableCell>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        aria-haspopup="true"
                                        size="icon"
                                        variant="ghost"
                                      >
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">
                                          Toggle menu
                                        </span>
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuLabel>
                                        Actions
                                      </DropdownMenuLabel>
                                      <DropdownMenuItem>Edit</DropdownMenuItem>
                                      <DropdownMenuItem>
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                      <CardFooter>
                        <div className="text-xs text-muted-foreground">
                          Showing{" "}
                          <strong>
                            {startingFrom}-{endTo}
                          </strong>{" "}
                          of <strong>{count}</strong> products
                        </div>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                </Tabs>
              </main>
            </div>
          </div>
        );
      }}
    </ParserLayout>
  );
}
