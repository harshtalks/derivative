"use client";

import {
  Clock,
  Code,
  Edit3,
  Inbox,
  Loader,
  Search,
  Sheet,
  Workflow,
} from "lucide-react";
import * as React from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import clientApiTrpc from "@/trpc/client";
import Branded from "@/types/branded.type";
import { formatDistanceToNow } from "date-fns";
import { Match } from "effect";
import TemplatePageEditorRouteInfo from "../editor/route.info";
import TemplatePageRouteInfo from "../route.info";
import { type Mail } from "./data";
import { MailDisplay } from "./display";
import { MailList } from "./list";
import { Nav } from "./nav";
import { useMail } from "./use-mail";
import Integration from "./wrapper-components/integration";
import Schema from "./wrapper-components/schema";
import TemplateMarkup from "./wrapper-components/template-markup";

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
  const [isCollapsed] = React.useState(defaultCollapsed);
  const [mail] = useMail();
  const { templateId, workspaceId } = TemplatePageRouteInfo.useParams();

  const query = clientApiTrpc.template.get.useQuery({
    templateId: Branded.TemplateId(templateId),
    workspaceId: Branded.WorkspaceId(workspaceId),
  });

  const { active } = TemplatePageRouteInfo.useSearchParams();

  return Match.value(query).pipe(
    Match.when({ status: "success" }, ({ data }) => {
      return (
        <TooltipProvider delayDuration={0}>
          <div className="flex h-[calc(100svh-100px)] overflow-hidden border-b items-stretch">
            <div className={cn("min-w-[350px] max-w-[350px]")}>
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
                  {
                    title: "Template Markup",
                    icon: Sheet,
                    variant: active === "template-markup" ? "default" : "ghost",
                    link: TemplatePageRouteInfo(
                      { templateId, workspaceId },
                      { search: { active: "template-markup" } },
                    ),
                  },
                ]}
              />
            </div>
            {Match.value(active).pipe(
              Match.when("inbox", () => (
                <div className="flex">
                  <div className="border-r border-l max-w-[500px]">
                    <Tabs defaultValue="all">
                      <div className="flex items-center px-4 py-2">
                        <h1 className="text-xl font-bold">Invoices</h1>
                        <TabsList className="ml-auto">
                          <TabsTrigger
                            value="all"
                            className="text-zinc-600 dark:text-zinc-200"
                          >
                            All
                          </TabsTrigger>
                          <TabsTrigger
                            value="unread"
                            className="text-zinc-600 dark:text-zinc-200"
                          >
                            Delivered
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
              )),
              Match.when("schema", () => (
                <Schema json={data.json} jsonSchema={data.jsonSchema} />
              )),
              Match.when("integration", () => <Integration />),
              Match.when("template-markup", () => (
                <TemplateMarkup
                  markup={data.template_markup?.markup}
                  jsonStr={data.json}
                />
              )),
              Match.exhaustive,
            )}
          </div>
        </TooltipProvider>
      );
    }),
    Match.when({ status: "pending", isLoading: true }, () => (
      <div className="w-full py-32 flex flex-col items-center justify-center">
        <Loader className="animate-spin shrink-0 size-4" />
        <p className="text-center text-muted-foreground text-xs pt-4">
          Fetching details...
        </p>
      </div>
    )),
    Match.when({ status: "error" }, ({ error }) => (
      <div className="w-full py-32 flex items-center justify-center">
        <p>{error.message}</p>
      </div>
    )),
    Match.exhaustive,
  );
}
