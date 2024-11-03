"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import clientApiTrpc from "@/trpc/client";
import { Match } from "effect";
import TemplatePageRouteInfo from "../../route.info";
import Branded from "@/types/branded.type";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { CopyIcon, ReloadIcon } from "@radix-ui/react-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Integration = () => {
  const { templateId, workspaceId } = TemplatePageRouteInfo.useParams();
  const utils = clientApiTrpc.useUtils();

  const query = clientApiTrpc.template.accessToken.useQuery({
    templateId: Branded.TemplateId(templateId),
    workspaceId: Branded.WorkspaceId(workspaceId),
  });
  const mutation = clientApiTrpc.template.createIntegrationKey.useMutation({
    onSuccess: () => {
      utils.template.accessToken.invalidate();
    },
  });

  return (
    <div className="border-r border-t border-l w-full">
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
          {Match.value(query).pipe(
            Match.when({ status: "pending" }, () => (
              <div className="flex w-full items-center gap-2 justify-center pt-12">
                <Loader className="shrink-0 size-4 animate-spin" />
                <p className="text-muted-foreground">Loading...</p>
              </div>
            )),
            Match.when({ status: "success" }, ({ data }) =>
              Match.value(data.length).pipe(
                Match.when(0, () => (
                  <div className="px-4 py-2">
                    <div className="py-32 flex items-center gap-4 justify-center flex-col">
                      <h4 className="text-4xl font-bold">Generate API key</h4>
                      <p className="text-sm text-muted-foreground">
                        You can integrate this template with your application by
                        generating an API key.
                      </p>
                      <Button
                        onClick={() => {
                          toast.promise(
                            mutation.mutateAsync({ templateId, workspaceId }),
                            {
                              loading: "Generating API key...",
                              success: "API key generated successfully",
                              error: (err) => "Failed to generate API key",
                            },
                          );
                        }}
                        variant="ringHover"
                      >
                        Generate API Key
                      </Button>
                    </div>
                  </div>
                )),
                Match.orElse(() => (
                  <div className="px-4 py-2">
                    <div className="py-32 flex items-center gap-4 justify-center flex-col">
                      <h4 className="text-4xl font-bold">API Access Token</h4>
                      <p className="text-sm text-muted-foreground">
                        You can use this API key to call this template&apos;s
                        API from your application.
                      </p>
                      <div className="bg-muted p-4 rounded-lg">
                        <p className="text-muted-foreground font-mono">
                          {data[0].integrationKey}
                        </p>
                      </div>
                      <TooltipProvider>
                        <div>
                          <Tooltip>
                            <TooltipContent>Copy API key</TooltipContent>
                            <TooltipTrigger asChild>
                              <Button
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    data[0].integrationKey,
                                  );
                                  toast.success("API key copied to clipboard");
                                }}
                                variant="ghost"
                              >
                                <CopyIcon />
                              </Button>
                            </TooltipTrigger>
                          </Tooltip>
                          <Tooltip>
                            <TooltipContent>
                              Regenerate API Access Token (will invalidate the
                              old one)
                            </TooltipContent>
                            <TooltipTrigger asChild>
                              <Button
                                onClick={() =>
                                  toast.promise(
                                    mutation.mutateAsync({
                                      templateId,
                                      workspaceId,
                                      regenerating: true,
                                    }),
                                    {
                                      loading: "Generating API key...",
                                      success:
                                        "API key generated successfully. Previous key is invalidated.",
                                      error: (err) =>
                                        "Failed to generate API key",
                                    },
                                  )
                                }
                                variant="ghost"
                              >
                                <ReloadIcon />
                              </Button>
                            </TooltipTrigger>
                          </Tooltip>
                        </div>
                      </TooltipProvider>
                    </div>
                  </div>
                )),
              ),
            ),
            Match.when({ status: "error" }, ({ error }) => (
              <div className="flex w-full items-center justify-center pt-12">
                <p className="text-red-500 dark:text-red-400">
                  {error.message}
                </p>
              </div>
            )),
            Match.exhaustive,
          )}
        </TabsContent>
        <TabsContent value="help" className="m-0">
          <div className="px-4 py-2 w-3/5"></div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Integration;
