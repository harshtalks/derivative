import validateGithubAuth from "@/app/api/auth/github/verify/route.info";
import { MiddlewareWrapper } from "@/types/middleware.type";
import { User } from "lucia";
import { NextResponse } from "next/server";
import { webAuthProtectedRoutes } from "./utils.middleware";
import { COOKIE_NAME, verifyJWT } from "@/auth/tf";
import { cookies } from "next/headers";
import WebAuthRoute from "@/app/(routes)/webauth/route.info";
import DashboardRoute from "@/app/(routes)/dashboard/route.info";

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
    const DashboardPath = DashboardRoute({}); //  constant value

    // read the request headers
    const requestHeaders = new Headers(request.headers);

    const callbackUrl = new URL(request.url);

    // get the request pathname
    const pathname = request.nextUrl.pathname;

    // fallback url for redirect

    const urlToFallback =
      pathname === WebAuthPath
        ? DashboardPath
        : WebAuthRoute({}, { search: { redirectUrl: callbackUrl.toString() } });

    // reading cookie from the request headers. Empty string if not found
    const cookiesFromReq = requestHeaders.get("cookie") || "";
    // make a request to /api/auth/github/verify to verify the user session

    // this also includes the web auth routes as well
    if (webAuthProtectedRoutes.includes(pathname)) {
      try {
        // get the data from the request validator

        const { user } = (await validateGithubAuth({
          params: {},
          requestOptions: {
            requestConfig: {
              headers: {
                Cookie: cookiesFromReq,
              },
            },
          },
        })) as {
          user: User;
        };

        // see if the user has two factor enabled
        const tfEnabled = user.twoFactorEnabled;

        if (!tfEnabled) {
          // if tf is not enabled, it does not make sense to user to send to the web auth page. user can later on enable it in the dashboard.
          if (pathname === WebAuthPath) {
            return NextResponse.redirect(new URL(DashboardPath, request.url));
          }

          // if two factor is not enabled, we can just call the next middleware
          // if the user pathname is not part of the protected routes
          const response = NextResponse.next();
          return nextMW(request, event, response);
        } else {
          // logic for two factor auth being enabled
          const webAuth = request.cookies.get(COOKIE_NAME);

          if (!webAuth) {
            throw new Error("You are not authenticated to view this page.");
          }

          const validJWT = await verifyJWT(webAuth.value);

          if (validJWT) {
            // if the JWT is valid, we can call the next middleware

            if (pathname === WebAuthPath) {
              return NextResponse.redirect(new URL(DashboardPath, request.url));
            }

            const response = NextResponse.next();
            return nextMW(request, event, response);
          } else {
            // if the JWT is not valid, we can redirect the user to the login page
            return NextResponse.redirect(new URL(urlToFallback, request.url));
          }
        }
      } catch (error) {
        // if the user is not found, redirect to the fallback defined above
        return NextResponse.redirect(new URL(urlToFallback, request.url));
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
