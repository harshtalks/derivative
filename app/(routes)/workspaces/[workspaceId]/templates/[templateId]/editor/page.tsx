import React from "react";
import AuthInterceptor from "@/auth/authIntercepter";
import TemplatePageEditorRouteInfo from "./route.info";
import Container from "@/app/_components/container";
import { RouteProps } from "@/types/next.type";
import ParserLayout from "@/components/parser-layout";
import { setCurrentWorkspace } from "@/app/(routes)/workspaces/route.info";
import Branded from "@/types/branded.type";
import { checkAccessForWorkspace } from "@/auth/access-check";
import EditorSidebar from "./_components/editor-sidebar";
import Editor from "@/editor/components/editor";

const page = async (props: RouteProps) => {
  return (
    <ParserLayout {...props} routeInfo={TemplatePageEditorRouteInfo}>
      {async ({ params }) => {
        setCurrentWorkspace(Branded.WorkspaceId(params.workspaceId));

        await new AuthInterceptor(TemplatePageEditorRouteInfo({ ...params }))
          .withRedirect()
          .withTwoFactor()
          .withAfterAuth(checkAccessForWorkspace)
          .check();

        return (
          <Container>
            <section className="grid items-center gap-6 pb-8">
              <div className="flex items-center justify-between">
                <div className="flex max-w-[980px] flex-col items-start gap-2">
                  <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
                    Template Editor
                  </h1>
                  <p className="max-w-[700px] text-muted-foreground">
                    Edit your template, fill your schema values and save.
                  </p>
                </div>
                <EditorSidebar />
              </div>
              <Editor />
            </section>
          </Container>
        );
      }}
    </ParserLayout>
  );
};

export default page;
