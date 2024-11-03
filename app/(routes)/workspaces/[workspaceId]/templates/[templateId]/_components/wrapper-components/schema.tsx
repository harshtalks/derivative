import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TemplateSchemaEditor from "../../../new-template/_components/template-schema-editor";
import { Separator } from "@/components/ui/separator";

const Schema = ({ json, jsonSchema }: { jsonSchema: string; json: string }) => {
  return (
    <div className="border-r border-t overflow-auto border-l w-full">
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
              {json}
            </pre>
          </div>
        </TabsContent>
        <TabsContent value="schema" className="m-0">
          <div className="px-4 py-2">
            <pre className="p-2 w-fit !font-mono bg-zinc-100 dark:bg-zinc-700 text-sm rounded-md">
              {JSON.stringify(JSON.parse(jsonSchema), null, 2)}
            </pre>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Schema;
