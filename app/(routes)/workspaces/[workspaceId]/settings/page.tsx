import { WorkspaceForm } from "./_components/workspace-form";
import AuthInterceptor from "@/auth/authIntercepter";
import WorkspaceSettingsRouteInfo from "./route.info";
import { checkAccessForWorkspace } from "@/auth/access-check";
import { brandedCurrentWorkspace, setCurrentWorkspace } from "../../route.info";
import { RouteProps } from "@/types/next.type";
import ParserLayout from "@/components/parser-layout";

export default async function SettingsWorkspacePage(routeProps: RouteProps) {
  return (
    <ParserLayout routeInfo={WorkspaceSettingsRouteInfo} {...routeProps}>
      {async ({ params, searchParams }) => {
        setCurrentWorkspace(params.workspaceId);

        await new AuthInterceptor(
          WorkspaceSettingsRouteInfo.navigate({
            workspaceId: brandedCurrentWorkspace(),
          }),
        )
          .withRedirect()
          .withAfterAuth(checkAccessForWorkspace)
          .withTwoFactor()
          .check();

        return (
          <div className="space-y-6">
            <WorkspaceForm />
          </div>
        );
      }}
    </ParserLayout>
  );
}
