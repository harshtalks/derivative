import { github, lucia } from "@/auth/lucia";
import { StatusCodes } from "http-status-codes";
import { cookies } from "next/headers";
import githubHandlers from "./route.info";
import db, { eq } from "@/database/db";
import { users } from "@/database/schema";
import { OAuth2RequestError } from "arctic";
import withError from "@/lib/sever/with-error";
import { NextRequest, NextResponse } from "next/server";

export const GET = withError(
  async (request: NextRequest) => {
    const url = new URL(request.url);

    const code = url.searchParams.get("code");

    const state = url.searchParams.get("state");

    const storedState = cookies().get("github_oauth_state")?.value ?? null;

    if (!code || !state || !storedState || state !== storedState) {
      return new NextResponse(null, {
        status: StatusCodes["TEMPORARY_REDIRECT"],
        statusText: "Temporary Redirect due to missing code or state",
      });
    }

    const token = await github.validateAuthorizationCode(code);

    const githubUserResponse = await githubHandlers.getGithubUser({
      params: {},
      requestOptions: {
        requestConfig: {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
          },
        },
      },
    });

    const githubUserEmailsResponse = await githubHandlers.getGithubUserEmails({
      params: {},
      requestOptions: {
        requestConfig: {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
          },
        },
      },
    });

    console.log("api call for user", githubUserResponse);

    const checkIfUserExists = await db
      .select()
      .from(users)
      .where(eq(users.githubId, githubUserResponse.login));

    if (checkIfUserExists.length > 0) {
      const session = await lucia.createSession(checkIfUserExists[0].id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);

      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );

      return new NextResponse(null, {
        status: StatusCodes["MOVED_TEMPORARILY"],
        headers: {
          Location: "/",
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
      })
      .returning();

    const session = await lucia.createSession(user[0].id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return new NextResponse(null, {
      status: StatusCodes["MOVED_TEMPORARILY"],
      headers: {
        Location: "/",
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
        });
      }
    },
  }
);
