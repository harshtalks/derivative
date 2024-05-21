import { validateRequest } from "@/auth/validate-request";
import db, { eq } from "@/database/db";
import { authenticators } from "@/database/schema";
import { env } from "@/env";
import withError from "@/lib/sever/with-error";
import { generateAuthenticationOptions } from "@simplewebauthn/server";
import { StatusCodes } from "http-status-codes";
import { NextResponse } from "next/server";

export const GET = withError(async (request) => {
  // 1. Retrieve the user from the database / Sessions

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

  const passKeys = await db
    .select()
    .from(authenticators)
    .where(eq(authenticators.userId, user.id));

  // 4. Get authentication options

  const options = await generateAuthenticationOptions({
    rpID: env.RP_ID,
    allowCredentials: passKeys.map((passKey) => ({
      id: passKey.id,
      transports: passKey.transports.split(",") as AuthenticatorTransport[],
    })),
    challenge: env.WEB_AUTH_CHALLENGE,
  });

  // 5. Return the options
  return NextResponse.json(options, {
    status: StatusCodes.CREATED,
    statusText: `Authentication options generated for user "${user.username}"`,
  });
});
