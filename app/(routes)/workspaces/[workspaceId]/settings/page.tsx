import { Separator } from "@/components/ui/separator";
import { WorkspaceForm } from "./_components/workspace-form";
import AuthInterceptor from "@/auth/authIntercepter";
import WorkspaceSettingsRouteInfo from "./route.info";
import Branded from "@/types/branded.type";

export default async function SettingsWorkspacePage({
  params,
}: {
  params: { workspaceId: string };
}) {
  await new AuthInterceptor(
    WorkspaceSettingsRouteInfo({
      workspaceId: Branded.WorkspaceId(params.workspaceId),
    })
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
