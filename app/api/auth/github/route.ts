import { github } from "@/auth/lucia";
import { generateState } from "arctic";
import { cookies } from "next/headers";
import { StatusCodes } from "http-status-codes";

export const GET = async (request: Request) => {
  try {
    const state = generateState();
    const url = await github.createAuthorizationURL(state, {
      scopes: ["user:email"],
    });

    cookies().set("github_oauth_state", state, {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 60 * 10,
      sameSite: "lax",
    });

    // cookie for redirect uri that will be hit after the callback url is hit by github
    const reqUrl = new URL(request.url);
    const redirectUrl = reqUrl.searchParams.get("redirectUrl");

    if (redirectUrl) {
      cookies().set("github_oauth_redirect", redirectUrl, {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 60 * 10,
        sameSite: "lax",
      });
    }

    return Response.redirect(url);
  } catch (e) {
    return new Response(
      e instanceof Error ? e.message : "something went wrong",
      { status: StatusCodes["BAD_GATEWAY"] }
    );
  }
};
