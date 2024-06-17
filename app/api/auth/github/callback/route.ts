import { github, lucia } from "@/auth/lucia";
import { StatusCodes } from "http-status-codes";
import { cookies } from "next/headers";
import githubHandlers from "./route.info";
import db, { eq } from "@/database/db";
import { users } from "@/database/schema";
import { OAuth2RequestError } from "arctic";
import withError from "@/lib/sever/with-error";
import { NextRequest, NextResponse, userAgent } from "next/server";
import WebAuthRoute from "@/app/(routes)/webauth/route.info";
import WorkspaceRouteInfo from "@/app/(routes)/workspaces/route.info";

export const GET = withError(
  async (request: NextRequest) => {
    const url = new URL(request.url);

    const { device, ua } = userAgent(request);

    const code = url.searchParams.get("code");

    const state = url.searchParams.get("state");

    const storedState = cookies().get("github_oauth_state")?.value ?? null;

    if (!code || !state || !storedState || state !== storedState) {
      return new NextResponse(null, {
        status: StatusCodes["TEMPORARY_REDIRECT"],
        statusText: "Temporary Redirect due to missing code or state",
        headers: {
          Location: "/sign-in",
        },
      });
    }

    const token = await github.validateAuthorizationCode(code);

    const githubUserResponse = await githubHandlers.getGithubUser({
      params: {},
      requestConfig: {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      },
    });

    const githubUserEmailsResponse = await githubHandlers.getGithubUserEmails({
      params: {},
      requestConfig: {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      },
    });

    const checkIfUserExists = await db
      .select()
      .from(users)
      .where(eq(users.githubId, githubUserResponse.login));

    if (checkIfUserExists.length > 0) {
      const session = await lucia.createSession(checkIfUserExists[0].id, {
        details: device,
        ua,
      });

      const sessionCookie = lucia.createSessionCookie(session.id);

      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );

      return new NextResponse(null, {
        status: StatusCodes["MOVED_TEMPORARILY"],
        headers: {
          Location: checkIfUserExists[0].twoFactorEnabled
            ? WebAuthRoute({})
            : WorkspaceRouteInfo({}),
        },
      });
    }

    const user = await db
      .insert(users)
      .values({
        githubId: githubUserResponse.login,
        username: githubUserResponse.name,
        avatar: githubUserResponse.avatar_url,
        name: githubUserResponse.name,
        email: githubUserEmailsResponse[0].email,
        twoFactorEnabled: true,
      })
      .returning();

    const session = await lucia.createSession(user[0].id, {
      details: device,
      ua,
    });

    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return new NextResponse(null, {
      status: StatusCodes["MOVED_TEMPORARILY"],
      headers: {
        Location: WebAuthRoute({}),
      },
    });
  },
  {
    error: (e) => {
      console.error(e);
      if (
        e instanceof OAuth2RequestError &&
        e.message === "bad_verification_code"
      ) {
        // invalid code
        return new NextResponse(null, {
          status: StatusCodes["BAD_REQUEST"],
          statusText: e.message,
          headers: {
            Location: "/404",
          },
        });
      }
    },
  }
);
