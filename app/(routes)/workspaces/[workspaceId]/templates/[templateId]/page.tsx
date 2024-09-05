import { validateRequestCached } from "@/auth/validate-request";
import React from "react";
import { TemplatePage } from "./_components/wrapper";
import { cookies } from "next/headers";
import { accounts, mails } from "./_components/data";
import withAuth from "@/auth/wrappers/withAuth";
import AuthInterceptor from "@/auth/authIntercepter";
import Branded from "@/types/branded.type";
import { checkAccessForWorkspace } from "@/auth/access-check";
import TemplatePageRouteInfo from "./route.info";
import { RouteProps } from "@/types/next.type";
import ParserLayout from "@/components/parser-layout";
import { setCurrentWorkspace } from "../../../route.info";

const page = async (props: RouteProps) => {
  // Validate the request
  return (
    <ParserLayout routeInfo={TemplatePageRouteInfo} {...props}>
      {async ({ params }) => {
        setCurrentWorkspace(params.workspaceId);
        await new AuthInterceptor(
          TemplatePageRouteInfo({
            workspaceId: Branded.WorkspaceId(params.workspaceId),
            templateId: Branded.TemplateId(params.templateId),
          }),
        )
          .withTwoFactor()
          .withAfterAuth(checkAccessForWorkspace)
          .withRedirect()
          .check();

        const layout = cookies().get("react-resizable-panels:layout");
        const collapsed = cookies().get("react-resizable-panels:collapsed");

        return (
          <TemplatePage
            accounts={accounts}
            mails={mails}
            defaultLayout={undefined}
            defaultCollapsed={undefined}
            navCollapsedSize={4}
          />
        );
      }}
    </ParserLayout>
  );
};

export default page;
