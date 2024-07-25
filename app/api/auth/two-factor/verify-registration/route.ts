import { validateRequest } from "@/auth/validate-request";
import db, { eq } from "@/database/db";
import { authenticators } from "@/database/schema";
import { env } from "@/env";
import withError from "@/lib/sever/with-error";
import { VerifyRegistrationBody } from "@/types/two-factor.type";
import { verifyRegistrationResponse } from "@simplewebauthn/server";
import { StatusCodes } from "http-status-codes";
import { NextResponse } from "next/server";
import { isoBase64URL } from "@simplewebauthn/server/helpers";
import { ErrorWrapperResponse } from "@/types/api.type";
import { COOKIE_NAME, createJWT } from "@/auth/tf";
import { cookies } from "next/headers";

export const POST = withError<ErrorWrapperResponse<{ message: string }>>(
  async (request) => {
    // get the user
    const { user } = await validateRequest();

    if (!user) {
      return new NextResponse(null, {
        status: StatusCodes["UNAUTHORIZED"],
        statusText: "Unauthorized",
      });
    }

    // check if the user has already registered for two factor authentication
    if (!Boolean(user.twoFactorEnabled)) {
      return new NextResponse(null, {
        status: StatusCodes["CONFLICT"],
        statusText: "You have not enabled two factor authentication yet",
      });
    }

    // body
    const body = (await request.json()) as VerifyRegistrationBody;

    const verification = await verifyRegistrationResponse({
      expectedChallenge: isoBase64URL.fromUTF8String(env.WEB_AUTH_CHALLENGE),
      expectedOrigin: env.RP_ORIGIN,
      expectedRPID: env.RP_ID,
      response: body.registrationResponse,
    });

    const { verified } = verification;

    if (verified) {
      const { registrationInfo } = verification;

      if (registrationInfo) {
        const {
          credentialID,
          credentialPublicKey,
          counter,
          credentialBackedUp,
        } = registrationInfo;

        await db.insert(authenticators).values({
          userId: user.id,
          id: credentialID,
          webAuthnUserId: body.webAuthUserId,
          counter,
          credentialPublicKey: credentialPublicKey,
          transports:
            body.registrationResponse.response.transports?.join(",") || "",
          backupStatus: credentialBackedUp,
          backupEligible: credentialBackedUp,
        });
      }

      // check for jwt here, we will do our two factor cookie submission and stuff here httpOnly
      const passkeys = await db
        .select()
        .from(authenticators)
        .where(eq(authenticators.webAuthnUserId, body.webAuthUserId));

      if (passkeys.length === 0) {
        return NextResponse.json(
          {
            success: false,
            message: `Could not find authenticator for user ${user.id}`,
          },
          {
            status: StatusCodes.NOT_FOUND,
            statusText: "Not found",
          }
        );
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
        secure: env.mode === "production",
      });

      return NextResponse.json(
        {
          success: true,
          response: {
            message:
              "Your authentication is verified and registered successfully",
          },
        },
        {
          status: StatusCodes["OK"],
          statusText: "Registration successful",
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Registration failed",
      },
      {
        status: StatusCodes["BAD_REQUEST"],
        statusText: "Bad request",
      }
    );
  },
  {
    error(e) {
      return NextResponse.json<ErrorWrapperResponse>(
        {
          success: false,
          message: e instanceof Error ? e.message : "Bad request",
        },
        {
          status: StatusCodes["BAD_REQUEST"],
          statusText: e instanceof Error ? e.message : "Bad request",
        }
      );
    },
  }
);
