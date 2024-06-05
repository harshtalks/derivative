import { MiddlewareWrapper } from "@/types/middleware.type";
import { publicRoutes, webAuthPublicRoutes } from "./utils.middleware";
import { NextResponse } from "next/server";
import SignInPage from "@/app/(routes)/sign-in/route.info";
import ValidateGithubAuth from "@/app/api/auth/github/verify/route.info";
import { User } from "lucia";
import WebAuthRoute from "@/app/(routes)/webauth/route.info";

const withAuth: MiddlewareWrapper = (nextMW) => {
  return async (request, event) => {
    // read the request headers
    const requestHeaders = new Headers(request.headers);

    // get the request pathname
    const pathname = request.nextUrl.pathname;

    // check if the user pathname is part of the protected routes
    if (!publicRoutes.includes(pathname)) {
      /**
       * -> Round trip to server to validate the request.
       * -> We do it because next.js runs this on EDGE and we are not edging enough with the database to validate the request.
       * -> Just hope that vercel will ever support edge functions with database connections.
       */

      // reading cookie from the request headers. Empty string if not found
      const cookiesFromReq = requestHeaders.get("cookie") || "";
      // make a request to /api/auth/github/verify to verify the user session

      try {
        // this has all the logic to validate the user session
        const response = await fetch(ValidateGithubAuth({}), {
          headers: {
            cookie: cookiesFromReq,
          },
        });
        if (!response.ok) {
          throw new Error("User not found");
        }

        const { user } = (await response.json()) as { user: User | null };

        if (!user) {
          throw new Error("User not found");
        } else {
          // if the user is found, return the next middleware

          return nextMW(request, event, NextResponse.next());
        }
      } catch (e) {
        // if the user is not found, redirect to the login page
        return NextResponse.redirect(new URL(SignInPage({}), request.url));
      }
    } else {
      // if the user pathname is not part of the protected routes
      const response = NextResponse.next();

      // return the next middleware
      return nextMW(request, event, response);
    }
  };
};

export default withAuth;
