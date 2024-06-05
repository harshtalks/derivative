import validateGithubAuth from "@/app/api/auth/github/verify/route.info";
import { MiddlewareWrapper } from "@/types/middleware.type";
import { User } from "lucia";
import { NextResponse } from "next/server";
import { publicRoutes, webAuthPublicRoutes } from "./utils.middleware";
import { COOKIE_NAME, verifyJWT } from "@/auth/tf";
import { cookies } from "next/headers";
import WebAuthRoute from "@/app/(routes)/webauth/route.info";
import DashboardRoute from "@/app/(routes)/workspaces/[workspaceId]/dashboard/route.info";
import WorkspaceRouteInfo from "@/app/(routes)/workspaces/route.info";
import { env } from "@/env";
import ValidateGithubAuth from "@/app/api/auth/github/verify/route.info";
import SignInPage from "@/app/(routes)/sign-in/route.info";

/**
 *
 * @param nextMW a middleware function
 *
 * @description this middleware is used to protect the webauth routes. if user has two factor enabled, they will be applied to the web auth security else they will be bypassed.
 */

const withWebAuthn: MiddlewareWrapper = (nextMW) => {
  return async (request, event) => {
    // this is our middleware logic for the webauthn

    // get the constant routes
    const WebAuthPath = WebAuthRoute({}); // constant value
    const workspacePath = WorkspaceRouteInfo({}); // constant value

    // read the request headers
    const requestHeaders = new Headers(request.headers);

    const callbackUrl = new URL(request.url);

    // get the request pathname
    const pathname = request.nextUrl.pathname;

    /**
     * if user is not authenticated, they will be redirected to this url. if user is from the webauth page, no need to redirect.
     */
    const redirectUrlInCaseOfFail =
      pathname !== WebAuthPath &&
      WebAuthRoute({}, { search: { redirectUrl: callbackUrl.toString() } });

    // reading cookie from the request headers. Empty string if not found
    const cookiesFromReq = requestHeaders.get("cookie") || "";
    // make a request to /api/auth/github/verify to verify the user session

    // this also includes the web auth routes as well
    if (!webAuthPublicRoutes.includes(pathname)) {
      console.log(pathname, "pathname");
      try {
        // get the data from the request validator

        const response = await fetch(ValidateGithubAuth({}), {
          headers: {
            cookie: cookiesFromReq,
          },
        });

        if (!response.ok) {
          return NextResponse.redirect(new URL(SignInPage({}), request.url));
        }

        const { user } = (await response.json()) as { user: User | null };

        if (!user) {
          return NextResponse.redirect(new URL(SignInPage({}), request.url));
        }

        // see if the user has two factor enabled
        const tfEnabled = user.twoFactorEnabled;

        if (!tfEnabled) {
          // if tf is not enabled, it does not make sense to user to send to the web auth page. user can later on enable it in the dashboard.
          if (pathname === WebAuthPath) {
            return NextResponse.redirect(new URL(workspacePath, request.url));
          }

          // if two factor is not enabled, we can just call the next middleware
          // if the user pathname is not part of the protected routes
          const response = NextResponse.next();
          return nextMW(request, event, response);
        } else {
          // logic for two factor auth being enabled
          const webAuth = request.cookies.get(COOKIE_NAME);

          const validJWT = await verifyJWT(webAuth?.value || "");

          if (validJWT) {
            if (pathname === WebAuthPath) {
              return NextResponse.redirect(new URL(workspacePath, request.url));
            }

            const response = NextResponse.next();
            return nextMW(request, event, response);
          } else {
            // if the JWT is not valid, we can redirect the user to the login page
            if (redirectUrlInCaseOfFail)
              return NextResponse.redirect(
                new URL(redirectUrlInCaseOfFail, request.url)
              );
          }
        }
      } catch (error) {
        console.error(error);

        // if the api route is being called, we can return a 401
        if (pathname.startsWith("/api")) {
          return new NextResponse(null, {
            status: 401,
            statusText: "Unauthorized",
          });
        }

        // if the user is not found, redirect to the fallback defined above

        if (redirectUrlInCaseOfFail)
          return NextResponse.redirect(
            new URL(redirectUrlInCaseOfFail, request.url)
          );
      }
    } else {
      // if the user pathname is not part of the protected routes

      const response = NextResponse.next();

      // return the next middleware
      return nextMW(request, event, response);
    }
  };
};

export default withWebAuthn;
