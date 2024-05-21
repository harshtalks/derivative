import { MiddlewareWrapper } from "@/types/middleware.type";
import { protectedRoutes } from "./utils.middleware";
import { NextResponse } from "next/server";
import validateGithubAuth from "@/app/api/auth/github/verify/route.info";
import SignInPage from "@/app/(routes)/sign-in/route.info";

const withAuth: MiddlewareWrapper = (nextMW) => {
  return async (request, event) => {
    // read the request headers
    const requestHeaders = new Headers(request.headers);

    // get the request pathname
    const pathname = request.nextUrl.pathname;

    // check if the user pathname is part of the protected routes
    if (protectedRoutes.includes(pathname)) {
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
        await validateGithubAuth({
          params: {},
          requestOptions: {
            requestConfig: {
              headers: {
                Cookie: cookiesFromReq,
              },
            },
          },
        });
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
