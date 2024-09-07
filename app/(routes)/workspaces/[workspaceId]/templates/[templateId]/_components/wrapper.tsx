"use client";

import * as React from "react";
import {
  AlertCircle,
  Archive,
  ArchiveX,
  Clock,
  Edit3,
  File,
  Inbox,
  Info,
  Loader,
  MessagesSquare,
  Search,
  Send,
  ShoppingCart,
  Trash2,
  Users2,
  Code,
  Workflow,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MailDisplay } from "./display";
import { Nav } from "./nav";
import { type Mail } from "./data";
import { MailList } from "./list";
import { AccountSwitcher } from "./account";
import { useMail } from "./use-mail";
import { ThemeToggle } from "@/app/_components/theme-toggle";
import { UserNav } from "@/app/_components/user";
import clientApiTrpc from "@/trpc/client";
import TemplatePageRouteInfo from "../route.info";
import Branded from "@/types/branded.type";
import { match } from "ts-pattern";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import TemplatePageEditorRouteInfo from "../editor/route.info";
import { Button } from "@/components/ui/button";
import TemplateSchemaEditor from "../../new-template/_components/template-schema-editor";

interface MailProps {
  accounts: {
    label: string;
    email: string;
    icon: React.ReactNode;
  }[];
  mails: Mail[];
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}

export function TemplatePage({
  accounts,
  mails,
  defaultLayout = [265, 440, 655],
  defaultCollapsed = false,
  navCollapsedSize,
}: MailProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const [mail] = useMail();
  const { templateId, workspaceId } = TemplatePageRouteInfo.useParams();

  const query = clientApiTrpc.template.get.useQuery({
    templateId: Branded.TemplateId(templateId),
    workspaceId: Branded.WorkspaceId(workspaceId),
  });

  const { active } = TemplatePageRouteInfo.useSearchParams();

  return match(query)
    .with({ status: "success" }, ({ data }) => {
      return (
        <TooltipProvider delayDuration={0}>
          <div className="flex h-[calc(100svh-100px)] overflow-hidden border-b items-stretch">
            <div className={cn("min-w-[350px] max-w-[350px]")}>
              <div
                className={cn(
                  "flex h-[52px] items-center gap-2 justify-center",
                  isCollapsed ? "h-[52px]" : "px-2",
                )}
              >
                <ThemeToggle />
                <AccountSwitcher
                  isCollapsed={isCollapsed}
                  accounts={accounts}
                />
              </div>
              <Separator />
              <div className="p-4">
                {/* DETAILS FOR TEMPLATE */}
                <div>
                  <h4 className="font-bold text-lg">{data.name}</h4>
                  <p className="text-muted-foreground text-xs">
                    {data.description}
                  </p>
                </div>
                <div className="flex flex-col gap-4 py-4">
                  {data.updatedAt && (
                    <div className="flex items-center gap-1">
                      <Clock className="shrink-0 size-3.5 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(data.updatedAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  )}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className="capitalize">{data.status}</Badge>
                    <Badge className="capitalize">
                      <Edit3 className="inline shrink-0 size-3 mr-2" />{" "}
                      {data.creator.user.name.toLowerCase()}
                    </Badge>
                    <Badge className="capitalize" variant="outline">
                      {data.category}
                    </Badge>
                    <Badge className="capitalize" variant="outline">
                      {data.subcategory}
                    </Badge>
                  </div>
                  {data.template_markup ? (
                    <div className="flex flex-col gap-2">
                      {data.template_markup.updatedAt && (
                        <p className="text-muted-foreground text-xs">
                          Markup for this template was last updated{" "}
                          <strong>
                            {formatDistanceToNow(
                              new Date(data.template_markup.updatedAt),
                              {
                                addSuffix: true,
                              },
                            )}{" "}
                          </strong>
                          on{" "}
                          {new Date(
                            data.template_markup.updatedAt,
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      )}
                      <TemplatePageEditorRouteInfo.Link
                        params={{ templateId, workspaceId }}
                      >
                        <Button variant="shine" className="text-xs" size="sm">
                          Edit Template Markup
                        </Button>
                      </TemplatePageEditorRouteInfo.Link>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <p className="text-muted-foreground text-xs">
                        template markup for this template is not available yet.
                        You can create one by clicking on the link below.
                      </p>
                      <TemplatePageEditorRouteInfo.Link
                        params={{ templateId, workspaceId }}
                      >
                        <Button variant="shine" className="text-xs" size="sm">
                          Create Template Markup
                        </Button>
                      </TemplatePageEditorRouteInfo.Link>
                    </div>
                  )}
                </div>
              </div>

              <Separator />
              <Nav
                isCollapsed={isCollapsed}
                links={[
                  {
                    title: "Inbox",
                    icon: Inbox,
                    variant: active === "inbox" ? "default" : "ghost",
                    link: TemplatePageRouteInfo(
                      { templateId, workspaceId },
                      { search: { active: "inbox" } },
                    ),
                  },
                  {
                    title: "Code",
                    icon: Code,
                    variant: active === "schema" ? "default" : "ghost",
                    link: TemplatePageRouteInfo(
                      { templateId, workspaceId },
                      { search: { active: "schema" } },
                    ),
                  },
                  {
                    title: "Integration",
                    icon: Workflow,
                    variant: active === "integration" ? "default" : "ghost",
                    link: TemplatePageRouteInfo(
                      { templateId, workspaceId },
                      { search: { active: "integration" } },
                    ),
                  },
                ]}
              />
            </div>
            {match(active)
              .with("inbox", () => (
                <div className="flex">
                  <div className="border-r border-l max-w-[500px]">
                    <Tabs defaultValue="all">
                      <div className="flex items-center px-4 py-2">
                        <h1 className="text-xl font-bold">Inbox</h1>
                        <TabsList className="ml-auto">
                          <TabsTrigger
                            value="all"
                            className="text-zinc-600 dark:text-zinc-200"
                          >
                            All mail
                          </TabsTrigger>
                          <TabsTrigger
                            value="unread"
                            className="text-zinc-600 dark:text-zinc-200"
                          >
                            Unread
                          </TabsTrigger>
                        </TabsList>
                      </div>
                      <Separator />
                      <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                        <form>
                          <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search" className="pl-8" />
                          </div>
                        </form>
                      </div>
                      <TabsContent value="all" className="m-0">
                        <MailList items={mails} />
                      </TabsContent>
                      <TabsContent value="unread" className="m-0">
                        <MailList items={mails.filter((item) => !item.read)} />
                      </TabsContent>
                    </Tabs>
                  </div>
                  <div>
                    <MailDisplay
                      mail={
                        mails.find((item) => item.id === mail.selected) || null
                      }
                    />
                  </div>
                </div>
              ))
              .with("schema", () => {
                return (
                  <div className="border-r border-l w-full">
                    <Tabs defaultValue="object">
                      <div className="flex items-center px-4 py-2">
                        <h1 className="text-xl font-bold">Schema</h1>
                        <TabsList className="ml-auto">
                          <TabsTrigger
                            value="schema"
                            className="text-zinc-600 dark:text-zinc-200"
                          >
                            JSON Schema
                          </TabsTrigger>
                          <TabsTrigger
                            value="object"
                            className="text-zinc-600 dark:text-zinc-200"
                          >
                            Sample Object
                          </TabsTrigger>
                        </TabsList>
                      </div>
                      <Separator />
                      <TabsContent value="object" className="m-0">
                        <div className="px-4 py-2">
                          <pre className="p-2 w-fit !font-mono bg-zinc-100 dark:bg-zinc-700 text-sm rounded-md">
                            {data.json}
                          </pre>
                        </div>
                      </TabsContent>
                      <TabsContent value="schema" className="m-0">
                        <div className="px-4 py-2 w-3/5">
                          <TemplateSchemaEditor
                            height={700}
                            value={data.jsonSchema}
                          />
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                );
              })
              .with("integration", () => {
                return (
                  <div className="border-r border-l w-full">
                    <Tabs defaultValue="integration">
                      <div className="flex items-center px-4 py-2">
                        <h1 className="text-xl font-bold">Schema</h1>
                        <TabsList className="ml-auto">
                          <TabsTrigger
                            value="integration"
                            className="text-zinc-600 dark:text-zinc-200"
                          >
                            Integration
                          </TabsTrigger>
                          <TabsTrigger
                            value="help"
                            className="text-zinc-600 dark:text-zinc-200"
                          >
                            Help
                          </TabsTrigger>
                        </TabsList>
                      </div>
                      <Separator />
                      <TabsContent value="integration" className="m-0">
                        <div className="px-4 py-2"></div>
                      </TabsContent>
                      <TabsContent value="help" className="m-0">
                        <div className="px-4 py-2 w-3/5"></div>
                      </TabsContent>
                    </Tabs>
                  </div>
                );
              })
              .exhaustive()}
          </div>
        </TooltipProvider>
      );
    })
    .with({ status: "pending" }, () => {
      return (
        <div className="w-full py-32 flex flex-col items-center justify-center">
          <Loader className="animate-spin shrink-0 size-4" />
          <p className="text-center text-muted-foreground text-xs pt-4">
            Fetching details...
          </p>
        </div>
      );
    })
    .with({ status: "error" }, ({ error }) => {
      return (
        <div className="w-full py-32 flex items-center justify-center">
          <p>{error.message}</p>
        </div>
      );
    })
    .exhaustive();
}
