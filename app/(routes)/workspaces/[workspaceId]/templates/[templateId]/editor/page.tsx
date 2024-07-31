import React from "react";
import { TemplatePageSchema } from "../route.info";
import AuthInterceptor from "@/auth/authIntercepter";
import TemplatePageEditorRouteInfo from "./route.info";
import PlateEditor from "@/components/plate-editor";
import Container from "@/app/_components/container";
import Header from "@/app/_components/header";
import { TooltipProvider } from "@/components/plate-ui/tooltip";
import TemplateTabs from "../_components/tabs";

const page = async ({ params }: { params: TemplatePageSchema }) => {
  await new AuthInterceptor(TemplatePageEditorRouteInfo({ ...params }))
    .withRedirect()
    .withTwoFactor()
    .check();

  return (
    <TooltipProvider
      disableHoverableContent
      delayDuration={500}
      skipDelayDuration={0}
    >
      <div className="mx-auto pt-4">
        <TemplateTabs defaultValue="editor" />
      </div>

      <Container>
        <section className="grid items-center gap-6 pb-8">
          <div className="flex max-w-[980px] flex-col items-start gap-2">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
              Template Editor
            </h1>
            <p className="max-w-[700px] text-muted-foreground">
              Edit your template, fill your schema values and save.
            </p>
          </div>

          <div className="max-w-[1336px] border bg-background rounded-lg">
            <PlateEditor />
          </div>
        </section>
      </Container>
    </TooltipProvider>
  );
};

export default page;
