import React, { Fragment } from "react";
import TemplatePageRouteInfo, { TemplatePageSchema } from "./route.info";
import AuthInterceptor from "@/auth/authIntercepter";
import TemplateTabs from "./_components/tabs";

const Page = async ({ params }: { params: TemplatePageSchema }) => {
  await new AuthInterceptor(TemplatePageRouteInfo({ ...params }))
    .withRedirect()
    .withTwoFactor()
    .check();

  return (
    <div className="mx-auto pt-4">
      <TemplateTabs />
    </div>
  );
};

export default Page;
