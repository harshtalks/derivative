import AuthInterceptor from "@/auth/authIntercepter";
import NewTemplateRouteInfo from "./route.info";
import { TemplateForm } from "./_components/tempate-form";
import { checkAccessForWorkspace } from "@/auth/access-check";
import { brandedCurrentWorkspace } from "../../../route.info";

const Page = async () => {
  await new AuthInterceptor(
    NewTemplateRouteInfo({ workspaceId: brandedCurrentWorkspace() }),
  )
    .withTwoFactor()
    .withRedirect()
    .withAfterAuth(checkAccessForWorkspace)
    .check();

  return <TemplateForm />;
};

export default Page;
