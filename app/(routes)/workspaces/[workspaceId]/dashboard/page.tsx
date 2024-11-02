import React from "react";
import AuthInterceptor from "@/auth/authIntercepter";
import DashboardRoute from "./route.info";

import DashboardLayout from "./_components/dashboardLayout";
import { checkAccessForWorkspace } from "@/auth/access-check";
import { brandedCurrentWorkspace, setCurrentWorkspace } from "../../route.info";
import { RouteProps } from "@/types/next.type";
import ParserLayout from "@/components/parser-layout";
import Branded from "@/types/branded.type";

const page = async (routeProps: RouteProps) => {
  return (
    <ParserLayout routeInfo={DashboardRoute} {...routeProps}>
      {async ({ params: { workspaceId } }) => {
        // setting the current worksapce
        setCurrentWorkspace(Branded.WorkspaceId(workspaceId));
        // Validate the request
        await new AuthInterceptor(
          DashboardRoute.navigate({
            workspaceId: brandedCurrentWorkspace(),
          }),
        )
          .withTwoFactor()
          .withRedirect()
          .withAfterAuth(checkAccessForWorkspace)
          .check();

        return <DashboardLayout />;
      }}
    </ParserLayout>
  );
};

export default page;
