import { Separator } from "@/components/plate-ui/separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Integration = () => {
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
          <div className="px-4 py-2">
            <div className="py-32 flex items-center gap-4 justify-center flex-col">
              <h4 className="text-4xl font-bold">Generate API key</h4>
              <p className="text-sm text-muted-foreground">
                You can integrate this template with your application by
                generating an API key.
              </p>
              <Button variant="ringHover">Generate API Key</Button>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="help" className="m-0">
          <div className="px-4 py-2 w-3/5"></div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Integration;
