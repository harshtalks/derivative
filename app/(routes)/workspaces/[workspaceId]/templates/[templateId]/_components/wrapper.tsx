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

  return match(query)
    .with({ status: "success" }, ({ data }) => {
      return (
        <TooltipProvider delayDuration={0}>
          <div className="h-full flex max-h-[800px] overflow-hidden border-b items-stretch">
            <div className={cn("min-w-[300px]")}>
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
                        {formatDistanceToNow(new Date(data.updatedAt * 1000), {
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
                      {data.updatedAt && (
                        <p className="text-muted-foreground text-xs">
                          Markup for this template was last updated on{" "}
                          <strong>
                            {formatDistanceToNow(
                              new Date(data.updatedAt * 1000),
                              {
                                addSuffix: true,
                              },
                            )}{" "}
                          </strong>
                          on{" "}
                          {new Date(data.updatedAt * 1000).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
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
                    title: "Meetings",
                    label: "972",
                    icon: Users2,
                    variant: "ghost",
                  },
                  {
                    title: "Updates",
                    label: "342",
                    icon: AlertCircle,
                    variant: "ghost",
                  },
                  {
                    title: "Forums",
                    label: "128",
                    icon: MessagesSquare,
                    variant: "ghost",
                  },
                  {
                    title: "Shopping",
                    label: "8",
                    icon: ShoppingCart,
                    variant: "ghost",
                  },
                  {
                    title: "Promotions",
                    label: "21",
                    icon: Archive,
                    variant: "ghost",
                  },
                ]}
              />
            </div>
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
                mail={mails.find((item) => item.id === mail.selected) || null}
              />
            </div>
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
