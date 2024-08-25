import React, { Fragment } from "react";
import TemplatePageRouteInfo from "./route.info";
import AuthInterceptor from "@/auth/authIntercepter";
import TemplateTabs from "./_components/tabs";
import { checkAccessForWorkspace } from "@/auth/access-check";
import { RouteProps } from "@/types/next.type";
import ParserLayout from "@/components/parser-layout";
import { setCurrentWorkspace } from "../../../route.info";
import Branded from "@/types/branded.type";
import TemplatePageEditorRouteInfo from "./editor/route.info";
import { Button } from "@/components/ui/button";

const Page = async (props: RouteProps) => {
  return (
    <ParserLayout {...props} routeInfo={TemplatePageRouteInfo}>
      {async ({ params }) => {
        setCurrentWorkspace(Branded.WorkspaceId(params.workspaceId));
        await new AuthInterceptor(TemplatePageRouteInfo({ ...params }))
          .withRedirect()
          .withTwoFactor()
          .withAfterAuth(checkAccessForWorkspace)
          .check();

        return (
          <div className="mx-auto pt-4">
            Welcome to the RoutePage
            <TemplatePageEditorRouteInfo.Link params={params}>
              <Button>Go to Editor</Button>
            </TemplatePageEditorRouteInfo.Link>
          </div>
        );
      }}
    </ParserLayout>
  );
};

export default Page;
