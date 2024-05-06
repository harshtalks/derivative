import { github } from "@/auth/lucia";
import { generateState } from "arctic";
import { cookies } from "next/headers";
import { StatusCodes } from "http-status-codes";

export const GET = async () => {
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

    return Response.redirect(url);
  } catch (e) {
    return new Response(
      e instanceof Error ? e.message : "something went wrong",
      { status: StatusCodes["BAD_GATEWAY"] }
    );
  }
};
