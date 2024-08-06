import React from "react";
import AuthInterceptor from "@/auth/authIntercepter";
import DashboardRoute from "./route.info";

import DashboardLayout from "./_components/dashboardLayout";
import { brandedCurrentWorkspace } from "../layout";

const page = async () => {
  // Validate the request
  await new AuthInterceptor(
    DashboardRoute({
      workspaceId: brandedCurrentWorkspace(),
    }),
  )
    .withTwoFactor()
    .withRedirect()
    .check();

  return <DashboardLayout />;
};

export default page;
