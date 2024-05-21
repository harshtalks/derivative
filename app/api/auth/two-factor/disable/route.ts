import { validateRequest } from "@/auth/validate-request";
import db, { eq } from "@/database/db";
import { users } from "@/database/schema";
import withError from "@/lib/sever/with-error";
import { StatusCodes } from "http-status-codes";
import { NextResponse } from "next/server";

export const GET = withError(async (request) => {
  const { user } = await validateRequest();

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      {
        status: StatusCodes["UNAUTHORIZED"],
        statusText: "Unauthorized",
      }
    );
  }

  const body = (await request.json()) as { value: false };

  if (!Boolean(user.twoFactorEnabled)) {
    return NextResponse.json(
      {
        success: false,
        message: "You have already disabled two factor authentication yet",
      },
      {
        status: StatusCodes["CONFLICT"],
        statusText: "You have already disabled two factor authentication yet",
      }
    );
  }

  await db
    .update(users)
    .set({ twoFactorEnabled: body.value })
    .where(eq(users.id, user.id));

  return NextResponse.json(
    { success: true, message: "Two Factor disabled for you." },
    {
      status: StatusCodes["OK"],
      statusText: "Two factor authentication is disabled",
    }
  );
});
