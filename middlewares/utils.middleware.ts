import DashboardRoute from "@/app/(routes)/workspaces/[workspaceId]/dashboard/route.info";
import WebAuthRoute from "@/app/(routes)/webauth/route.info";
import WorkspaceRouteInfo from "@/app/(routes)/workspaces/route.info";

export const SAMPLE_ID = "sample-id";

// regex function to see if any route is present in the webAuthProtectedRoutes

export const publicRoutes = [
  "/",
  "/sign-in",
  "/api/auth/github",
  "/api/auth/github/verify",
  "/api/auth/github/callback",
];

export const webAuthPublicRoutes = [
  ...publicRoutes,
  "/api/auth/two-factor/authenticate",
  "/api/auth/two-factor/disable",
  "/api/auth/two-factor/enable",
  "/api/auth/two-factor/registration",
  "/api/auth/two-factor/sign",
  "/api/auth/two-factor/verify",
  "/api/auth/two-factor/verify-authentication",
  "/api/auth/two-factor/verify-registration",
];
