import React from "react";
import Hero from "./_components/Hero";
import withAuth from "@/auth/wrappers/withAuth";
import WebAuthRoute from "./route.info";
import { validateTFAuthCached } from "@/auth/validate-request";
import WorkspaceRouteInfo from "../workspaces/route.info";
import { redirect } from "next/navigation";
import AuthInterceptor from "@/auth/authIntercepter";

const page = async ({
  searchParams,
}: {
  searchParams: typeof WebAuthRoute.searchParams;
}) => {
  await new AuthInterceptor(WebAuthRoute({}))
    .withTwoFactor()
    .setRedirect(searchParams.redirectUrl ?? WorkspaceRouteInfo({}))
    .execute();

  return <Hero />;
};

export default page;
