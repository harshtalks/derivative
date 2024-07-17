import { COOKIE_NAME, createJWT } from "@/auth/tf";
import { validateRequest } from "@/auth/validate-request";
import db, { and, eq } from "@/database/db";
import { authenticators } from "@/database/schema";
import { env } from "@/env";
import withError from "@/lib/sever/with-error";
import { ErrorWrapperResponse } from "@/types/api.type";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import { isoBase64URL } from "@simplewebauthn/server/helpers";
import { AuthenticationResponseJSON } from "@simplewebauthn/types";
import { StatusCodes } from "http-status-codes";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const POST = withError<ErrorWrapperResponse<{ message: string }>>(
  async (request) => {
    // 0. get body
    const body = (await request.json()) as {
      response: AuthenticationResponseJSON;
    };

    // 1. get user
    const { user } = await validateRequest();

    // 2. verify the user
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: StatusCodes.UNAUTHORIZED,
          statusText: "Unauthorized",
        }
      );
    }

    // 3. verify the user has enabled two factor authentication
    if (!Boolean(user.twoFactorEnabled)) {
      return NextResponse.json(
        {
          success: false,
          message: "You have not enabled two factor authentication yet",
        },
        {
          status: StatusCodes.CONFLICT,
          statusText: "Conflict",
        }
      );
    }

    // 4. Retrieve a passkey from the DB that should match the `id` in the returned credential

    const passkeys = await db
      .select()
      .from(authenticators)
      .where(
        and(
          eq(authenticators.id, body.response.id),
          eq(authenticators.userId, user.id)
        )
      );

    if (passkeys.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Could not find passkey ${body.response.id} for user ${user.id}`,
        },
        {
          status: StatusCodes.NOT_FOUND,
          statusText: `Could not find passkey ${body.response.id} for user ${user.id}`,
        }
      );
    }

    // get the passkey
    const passkey = passkeys[0];

    // 5. verify the authentication response
    const verification = await verifyAuthenticationResponse({
      response: body.response,
      expectedChallenge: isoBase64URL.fromUTF8String(env.WEB_AUTH_CHALLENGE),
      expectedOrigin: env.RP_ORIGIN,
      expectedRPID: env.RP_ID,
      authenticator: {
        credentialID: passkey.id,
        credentialPublicKey: passkey.credentialPublicKey as Uint8Array,
        counter: passkey.counter,
        transports: passkey.transports.split(",") as AuthenticatorTransport[],
      },
    });

    const {
      verified,
      authenticationInfo: { newCounter },
    } = verification;

    // 6. update the database

    await db
      .update(authenticators)
      .set({ counter: newCounter })
      .where(eq(authenticators.id, passkey.id));

    if (verified) {
      const passkeys = await db
        .select()
        .from(authenticators)
        .where(eq(authenticators.id, body.response.id));

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
        {
          success: true,
          response: {
            message: "You are authenticated successfully",
          },
        },
        {
          status: StatusCodes.OK,
          statusText: "OK",
        }
      );
    }

    return NextResponse.json(
      { success: false, message: "Verification failed" },
      {
        status: StatusCodes.FORBIDDEN,
        statusText: "Forbidden",
      }
    );
  },
  {
    error: (e) =>
      new NextResponse(null, {
        status: StatusCodes.BAD_REQUEST,
        statusText: e instanceof Error ? e.message : "Bad request",
      }),
  }
);
