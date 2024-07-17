import { COOKIE_NAME, createJWT } from "@/auth/tf";
import { validateRequest } from "@/auth/validate-request";
import db, { eq } from "@/database/db";
import { authenticators } from "@/database/schema";
import withError from "@/lib/sever/with-error";
import { NullResponseType } from "@/types/api.type";
import { StatusCodes } from "http-status-codes";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SignJWTRequest } from "./route.info";

export const POST = withError<NullResponseType>(
  async (request) => {
    const { user } = await validateRequest();

    if (!user) {
      return new NextResponse(null, {
        status: StatusCodes.UNAUTHORIZED,
        statusText: "Unauthorized",
      });
    }

    const body = (await request.json()) as SignJWTRequest;

    // get authenticator

    const passkeys = await db
      .select()
      .from(authenticators)
      .where(
        body.type === "authenticationFlow"
          ? eq(authenticators.id, body.authId)
          : eq(authenticators.webAuthnUserId, body.webAuthId)
      );

    if (passkeys.length === 0) {
      return new NextResponse(null, {
        status: StatusCodes.NOT_FOUND,
        statusText: `Could not find authenticator for user ${user.id}`,
      });
    }

    // get the authenticator
    const authenticator = passkeys[0];

    // sign the authenticator

    const jwtSignResponse = await createJWT({
      userId: user.id,
      authenticatorId: authenticator.id,
      userAuthId: authenticator.webAuthnUserId,
    });

    // set cookie here

    cookies().set(COOKIE_NAME, jwtSignResponse, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      sameSite: "strict",
      httpOnly: true,
    });

    return NextResponse.json(
      { success: true, message: "Signed successfully" },
      {
        status: StatusCodes.OK,
      }
    );
  },
  {
    logError: true,
  }
);
