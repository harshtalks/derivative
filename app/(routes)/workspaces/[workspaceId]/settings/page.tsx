import { Separator } from "@/components/ui/separator";
import { WorkspaceForm } from "./_components/workspace-form";
import AuthInterceptor from "@/auth/authIntercepter";
import WorkspaceSettingsRouteInfo from "./route.info";
import Branded from "@/types/branded.type";
import { brandedCurrentWorkspace } from "../layout";

export default async function SettingsWorkspacePage() {
  await new AuthInterceptor(
    WorkspaceSettingsRouteInfo({
      workspaceId: brandedCurrentWorkspace(),
    }),
  )
    .withRedirect()
    .withTwoFactor()
    .check();

  return (
    <div className="space-y-6">
      <WorkspaceForm />
    </div>
  );
}
