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
import { ErrorWrapperResponse } from "@/types/api.type";
import SignInPage from "@/app/(routes)/sign-in/route.info";
import * as Http from "@effect/platform/HttpClient";
import { Effect } from "effect";

export const GET = withError<ErrorWrapperResponse<string>>(
  async (request: NextRequest) => {
    const url = new URL(request.url);
    const redirectUrl = cookies().get("github_oauth_redirect")?.value ?? null;

    const webAuthUrl = redirectUrl
      ? WebAuthRoute({}, { search: { redirectUrl } })
      : WebAuthRoute({});

    const destination = redirectUrl ?? WorkspaceRouteInfo({});

    const { device, ua } = userAgent(request);

    const code = url.searchParams.get("code");

    const state = url.searchParams.get("state");

    const storedState = cookies().get("github_oauth_state")?.value ?? null;

    if (!code || !state || !storedState || state !== storedState) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid code or state",
        },
        {
          status: StatusCodes["TEMPORARY_REDIRECT"],
          statusText: "Temporary Redirect due to missing code or state",
          headers: {
            Location: "/sign-in",
          },
        }
      );
    }

    const token = await github.validateAuthorizationCode(code);

    const githubUserEffect = githubHandlers.getGithubUserEffect(
      token.accessToken
    );

    const githubUserResponse = await Effect.runPromise(githubUserEffect);

    const githubUserEmailsEffect = githubHandlers.getGithubUserEmailsEffect(
      token.accessToken
    );

    const githubUserEmailsResponse = await Effect.runPromise(
      githubUserEmailsEffect
    );

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

      return NextResponse.json(
        {
          success: true,
          response: "User already exists",
        },
        {
          status: StatusCodes["MOVED_TEMPORARILY"],
          headers: {
            Location: checkIfUserExists[0].twoFactorEnabled
              ? webAuthUrl
              : destination,
          },
        }
      );
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

    return NextResponse.json(
      {
        success: true,
        response: "User created successfully",
      },
      {
        status: StatusCodes["MOVED_TEMPORARILY"],
        headers: {
          Location: checkIfUserExists[0].twoFactorEnabled
            ? webAuthUrl
            : destination,
        },
      }
    );
  },
  {
    error: (e) => {
      console.error(e);
      if (
        e instanceof OAuth2RequestError &&
        e.message === "bad_verification_code"
      ) {
        // invalid code
        return NextResponse.json<ErrorWrapperResponse>(
          {
            message: e.message,
            success: false,
          },
          {
            status: StatusCodes["BAD_REQUEST"],
            statusText: e.message,
            headers: {
              Location: SignInPage({}),
            },
          }
        );
      }
    },
  }
);
