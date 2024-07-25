import React from "react";
import AuthInterceptor from "@/auth/authIntercepter";
import DashboardRoute from "./route.info";

import DashboardLayout from "./_components/dashboardLayout";

const page = async ({ params }: { params: { workspaceId: string } }) => {
  // Validate the request
  await new AuthInterceptor(
    DashboardRoute({
      workspaceId: params.workspaceId,
    })
  )
    .withTwoFactor()
    .withRedirect()
    .check();

  return <DashboardLayout workspaceId={params.workspaceId} />;
};

export default page;
