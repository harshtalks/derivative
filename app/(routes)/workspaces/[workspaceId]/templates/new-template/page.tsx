import AuthInterceptor from "@/auth/authIntercepter";
import NewTemplateRouteInfo from "./route.info";
import { brandedCurrentWorkspace } from "../../layout";
import { TemplateForm } from "./_components/tempate-form";

const Page = async () => {
  await new AuthInterceptor(
    NewTemplateRouteInfo({ workspaceId: brandedCurrentWorkspace() }),
  )
    .withTwoFactor()
    .withRedirect()
    .check();

  return <TemplateForm />;
};

export default Page;
