import { validateRequest } from "@/auth/validate-request";
import db from "@/database/db";
import { authenticators } from "@/database/schema";
import { env } from "@/env";
import withError from "@/lib/sever/with-error";
import { VerifyRegistrationBody } from "@/types/two-factor.type";
import { verifyRegistrationResponse } from "@simplewebauthn/server";
import { StatusCodes } from "http-status-codes";
import { NextResponse } from "next/server";
import { isoBase64URL } from "@simplewebauthn/server/helpers";

export const POST = withError<null | { verified: boolean }>(
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
          lastUsed: Date.now(),
        });
      }
    }

    return NextResponse.json(
      { verified },
      {
        status: verified ? StatusCodes["OK"] : StatusCodes["FORBIDDEN"],
        statusText: verified
          ? "Registration successful"
          : "Registration failed",
      }
    );
  },
  {
    error(e) {
      return new NextResponse(null, {
        status: StatusCodes["BAD_REQUEST"],
        statusText: e instanceof Error ? e.message : "Bad request",
      });
    },
  }
);
