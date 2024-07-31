"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SchemaForm from "./schema-form";
import TemplatePageEditorRouteInfo from "../editor/route.info";
import { useRouter } from "next/navigation";
import TemplatePageRouteInfo from "../route.info";
import { toast } from "sonner";

const TemplateTabs = ({
  defaultValue = "schema",
}: {
  defaultValue?: "schema" | "editor";
}) => {
  const { push: editorPush } = TemplatePageEditorRouteInfo.useRouter(useRouter);
  const { push: templateSchemaPush } =
    TemplatePageRouteInfo.useRouter(useRouter);
  const params = TemplatePageRouteInfo.useSafeParams();

  return (
    <Tabs
      defaultValue={defaultValue}
      onValueChange={(e) => {
        if (!params.success) {
          return toast.error("something went wrong with the params");
        }

        if (e === "editor") {
          editorPush({ params: params.data });
        } else {
          templateSchemaPush({ params: params.data });
        }
      }}
      className="w-[600px]"
    >
      <TabsList className="grid w-fit mx-auto grid-cols-2">
        <TabsTrigger value="schema">Schema</TabsTrigger>
        <TabsTrigger value="editor">Editor</TabsTrigger>
      </TabsList>
      <TabsContent value="schema">
        <SchemaForm />
      </TabsContent>
    </Tabs>
  );
};

export default TemplateTabs;
