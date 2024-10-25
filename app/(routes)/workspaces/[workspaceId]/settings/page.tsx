import { Separator } from "@/components/ui/separator";
import { WorkspaceForm } from "./_components/workspace-form";
import AuthInterceptor from "@/auth/authIntercepter";
import WorkspaceSettingsRouteInfo from "./route.info";
import Branded from "@/types/branded.type";
import { checkAccessForWorkspace } from "@/auth/access-check";
import { brandedCurrentWorkspace } from "../../route.info";

export default async function SettingsWorkspacePage() {
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
}
