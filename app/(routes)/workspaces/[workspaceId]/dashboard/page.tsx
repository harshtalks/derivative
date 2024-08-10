import React from "react";
import AuthInterceptor from "@/auth/authIntercepter";
import DashboardRoute from "./route.info";

import DashboardLayout from "./_components/dashboardLayout";
import { checkAccessForWorkspace } from "@/auth/access-check";
import { brandedCurrentWorkspace } from "../../route.info";

const page = async () => {
  // Validate the request
  await new AuthInterceptor(
    DashboardRoute({
      workspaceId: brandedCurrentWorkspace(),
    }),
  )
    .withTwoFactor()
    .withRedirect()
    .withAfterAuth(checkAccessForWorkspace)
    .check();

  return <DashboardLayout />;
};

export default page;
