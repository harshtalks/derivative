import { validateRequest } from "@/auth/validate-request";
import db, { eq } from "@/database/db";
import { authenticators, users } from "@/database/schema";
import withError from "@/lib/sever/with-error";
import { StatusCodes } from "http-status-codes";
import { NextResponse } from "next/server";
import { generateRegistrationOptions } from "@simplewebauthn/server";
import { env } from "@/env";
import { PublicKeyCredentialCreationOptionsJSON } from "@simplewebauthn/types";
import { isoBase64URL } from "@simplewebauthn/server/helpers";

export const GET = withError<null | PublicKeyCredentialCreationOptionsJSON>(
  async () => {
    /**
     * We will have step by step guide to register the user for two factor authentication.
     */
    // 1. Retrieve the user from the database

    const { user } = await validateRequest();

    if (!user) {
      return new NextResponse(null, {
        status: StatusCodes["UNAUTHORIZED"],
        statusText: "Unauthorized",
      });
    }

    // 2. Check if the user has already registered for two factor authentication
    if (!Boolean(user.twoFactorEnabled)) {
      return new NextResponse(null, {
        status: StatusCodes["CONFLICT"],
        statusText: "You have not enabled two factor authentication yet",
      });
    }

    // 3. get all the authenticators for the user
    const userPassKeys = await db
      .select()
      .from(authenticators)
      .where(eq(authenticators.userId, user.id));

    console.log(userPassKeys);

    // 4. Get options
    const options = await generateRegistrationOptions({
      rpName: env.RP_NAME,
      rpID: env.RP_ID,
      userName: user.username,
      // Don't prompt users for additionasl information about the authenticator
      // (Recommended for smoother UX)
      attestationType: "none",
      // Prevent users from re-registering existing authenticators
      excludeCredentials: userPassKeys.map((passkey) => ({
        id: passkey.id,
        // Optional
        transports: passkey.transports.split(",") as AuthenticatorTransport[],
      })),
      // See "Guiding use of authenticators via authenticatorSelection" below
      authenticatorSelection: {
        // Defaults
        residentKey: "preferred",
        userVerification: "preferred",
        // Optional
        authenticatorAttachment: "platform",
      },

      // we are using custom challenge here
      // !TODO - Implement custom challenge with in memory storage for later -> support for user specific challenges
      challenge: env.WEB_AUTH_CHALLENGE,
    });

    // 5 Return the options to the user
    return NextResponse.json(options, {
      status: StatusCodes.CREATED,
      statusText: "Registration options generated",
    });
  },
  {
    // Log errors
    logError: true,
  }
);
