import AuthInterceptor from "@/auth/authIntercepter";
import NewTemplateRouteInfo from "./route.info";
import {
  brandedCurrentWorkspace,
  setCurrentWorkspace,
} from "../../../route.info";
import { RouteProps } from "@/types/next.type";
import ParserLayout from "@/components/parser-layout";
import { TemplateForm } from "./_components/tempate-form";
import { checkAccessForWorkspace } from "@/auth/access-check";
import serverApiTrpc from "@/trpc/server";
import Branded from "@/types/branded.type";

const Page = async (routeProps: RouteProps) => {
  return (
    <ParserLayout routeInfo={NewTemplateRouteInfo} {...routeProps}>
      {async ({ params, searchParams }) => {
        // set current workspace - server ctx
        setCurrentWorkspace(params.workspaceId);
        // auth check
        await new AuthInterceptor(
          NewTemplateRouteInfo.navigate({
            workspaceId: brandedCurrentWorkspace(),
          }),
        )
          .withTwoFactor()
          .withRedirect()
          .withAfterAuth(checkAccessForWorkspace)
          .check();

        const { templateId } = searchParams;

        if (!templateId) {
          return <TemplateForm />;
        }

        const template = await serverApiTrpc.template.get({
          templateId: Branded.TemplateId(templateId),
          workspaceId: brandedCurrentWorkspace(),
        });

        return (
          <TemplateForm
            existingTemplate={{
              category: template.category,
              description: template.description,
              name: template.name,
              schema: {
                json: template.json,
                type: "text",
              },
              status: template.status,
              subCategory: template.subcategory,
            }}
          />
        );
      }}
    </ParserLayout>
  );
};

export default Page;
