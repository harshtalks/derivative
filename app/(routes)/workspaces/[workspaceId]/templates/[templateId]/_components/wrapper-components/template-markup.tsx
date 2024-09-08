import { Separator } from "@/components/plate-ui/separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plate } from "@udecode/plate-common";
import { Editor } from "@/components/plate-ui/editor";
import { plugins } from "@/lib/plate/plate-plugins";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useReducer } from "react";
import { compile } from "handlebars";
import { iife } from "@/lib/utils";
import TemplatePageRouteInfo from "../../route.info";
import TemplatePageEditorRouteInfo from "../../editor/route.info";

const TemplateMarkup = ({
  markup,
  jsonStr,
}: {
  markup?: string;
  jsonStr: string;
}) => {
  const { templateId, workspaceId } = TemplatePageRouteInfo.useParams();
  const { sampled, active } = TemplatePageRouteInfo.useSearchParams();

  return (
    <div className="border-r border-l w-full overflow-scroll">
      <Tabs defaultValue="markup">
        <div className="flex items-center px-4 py-2">
          <h1 className="text-xl font-bold">Template Markup</h1>
          <TabsList className="ml-auto">
            <TabsTrigger
              value="markup"
              className="text-zinc-600 dark:text-zinc-200"
            >
              Markup
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
        <TabsContent value="markup" className="m-0">
          <div className="px-4 py-4 bg-white">
            {markup ? (
              iife(() => {
                const template = compile(markup);
                const data = template(JSON.parse(jsonStr));

                return (
                  <DndProvider backend={HTML5Backend}>
                    <Plate
                      key={sampled.toString()}
                      plugins={plugins}
                      initialValue={JSON.parse(sampled ? data : markup)}
                    >
                      <div className="flex items-center gap-2">
                        <TemplatePageRouteInfo.Link
                          params={{ templateId, workspaceId }}
                          searchParams={{
                            active: active,
                            sampled: sampled ? "false" : "true",
                          }}
                        >
                          <Button className="text-xs" size="sm">
                            Fill Dummy Data
                          </Button>
                        </TemplatePageRouteInfo.Link>
                        <TemplatePageEditorRouteInfo.Link
                          params={{ templateId, workspaceId }}
                        >
                          <Button
                            className="text-xs"
                            size="sm"
                            variant="secondary"
                          >
                            Edit Template
                          </Button>
                        </TemplatePageEditorRouteInfo.Link>
                      </div>
                      <Editor
                        className="px-20 py-16 opacity-100"
                        autoFocus
                        focusRing={false}
                        variant="ghost"
                        disabled
                      />
                    </Plate>
                  </DndProvider>
                );
              })
            ) : (
              <div className="py-32 flex items-center gap-4 justify-center flex-col">
                <h4 className="text-4xl font-bold">No Markup found</h4>
                <p className="text-sm text-muted-foreground">
                  Looks like, you have not created a markup for this template.
                  Use our editor to create a markup.
                </p>
                <TemplatePageEditorRouteInfo.Link
                  params={{ templateId, workspaceId }}
                >
                  <Button variant="ringHover">Create a template markup</Button>
                </TemplatePageEditorRouteInfo.Link>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="help" className="m-0">
          <div className="px-4 py-2 w-3/5"></div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TemplateMarkup;
