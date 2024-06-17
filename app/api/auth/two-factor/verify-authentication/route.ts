import { validateRequest } from "@/auth/validate-request";
import db, { and, eq } from "@/database/db";
import { authenticators } from "@/database/schema";
import { env } from "@/env";
import withError from "@/lib/sever/with-error";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import { isoBase64URL } from "@simplewebauthn/server/helpers";
import { AuthenticationResponseJSON } from "@simplewebauthn/types";
import { StatusCodes } from "http-status-codes";
import { NextResponse } from "next/server";

export const POST = withError<null | { success: boolean; message: string }>(
  async (request) => {
    // 0. get body
    const body = (await request.json()) as {
      response: AuthenticationResponseJSON;
    };

    // 1. get user
    const { user } = await validateRequest();

    // 2. verify the user
    if (!user) {
      return new NextResponse(null, {
        status: StatusCodes.UNAUTHORIZED,
        statusText: "Unauthorized",
      });
    }

    // 3. verify the user has enabled two factor authentication
    if (!Boolean(user.twoFactorEnabled)) {
      return new NextResponse(null, {
        status: StatusCodes.CONFLICT,
        statusText: "Conflict",
      });
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
      return NextResponse.json(null, {
        status: StatusCodes.NOT_FOUND,
        statusText: `Could not find passkey ${body.response.id} for user ${user.id}`,
      });
    }

    console.log(isoBase64URL.fromUTF8String(env.WEB_AUTH_CHALLENGE));

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

    return NextResponse.json(
      { success: verified, message: verified ? "OK" : "Forbidden" },
      {
        status: verified ? StatusCodes.OK : StatusCodes.FORBIDDEN,
        statusText: verified ? "OK" : "Forbidden",
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
