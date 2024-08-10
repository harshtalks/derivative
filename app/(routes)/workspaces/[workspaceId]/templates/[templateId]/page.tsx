import React, { Fragment } from "react";
import TemplatePageRouteInfo, { TemplatePageSchema } from "./route.info";
import AuthInterceptor from "@/auth/authIntercepter";
import TemplateTabs from "./_components/tabs";
import { checkAccessForWorkspace } from "@/auth/access-check";

const Page = async ({ params }: { params: TemplatePageSchema }) => {
  await new AuthInterceptor(TemplatePageRouteInfo({ ...params }))
    .withRedirect()
    .withTwoFactor()
    .withAfterAuth(checkAccessForWorkspace)
    .check();

  return <div className="mx-auto pt-4"></div>;
};

export default Page;
