import { validateRequestCached } from "@/auth/validate-request";
import React from "react";
import { Mail } from "./_components/wrapper";
import { cookies } from "next/headers";
import { accounts, mails } from "./_components/data";
import withAuth from "@/auth/wrappers/withAuth";
import AuthInterceptor from "@/auth/authIntercepter";
import DashboardRoute from "./route.info";

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

  const layout = cookies().get("react-resizable-panels:layout");
  const collapsed = cookies().get("react-resizable-panels:collapsed");

  return (
    <Mail
      accounts={accounts}
      mails={mails}
      defaultLayout={undefined}
      defaultCollapsed={undefined}
      navCollapsedSize={4}
    />
  );
};

export default page;
