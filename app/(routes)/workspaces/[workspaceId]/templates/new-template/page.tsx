import AuthInterceptor from "@/auth/authIntercepter";
import NewTemplateRouteInfo from "./route.info";
import { TemplateForm } from "./_components/tempate-form";
import { checkAccessForWorkspace } from "@/auth/access-check";
import {
  brandedCurrentWorkspace,
  setCurrentWorkspace,
} from "../../../route.info";

const Page = async ({ params }: { params: { workspaceId: string } }) => {
  setCurrentWorkspace(params.workspaceId);

  await new AuthInterceptor(
    NewTemplateRouteInfo({
      workspaceId: brandedCurrentWorkspace(),
    }),
  )
    .withTwoFactor()
    .withRedirect()
    .withAfterAuth(checkAccessForWorkspace)
    .check();

  return <TemplateForm />;
};

export default Page;
