import { validateRequest } from "@/auth/validate-request";
import db, { eq } from "@/database/db";
import { users } from "@/database/schema";
import withError from "@/lib/sever/with-error";
import { StatusCodes } from "http-status-codes";
import { NextResponse } from "next/server";

export const POST = withError(
  async (request) => {
    const body = (await request.json()) as { value: true };

    const { user } = await validateRequest();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: StatusCodes["UNAUTHORIZED"],
          statusText: "Unauthorized",
        }
      );
    }

    if (user.twoFactorEnabled) {
      return NextResponse.json(
        { success: true, message: "Two Factor was already enabled for you." },
        {
          status: StatusCodes["ACCEPTED"],
          statusText: "You have already enabled two factor authentication",
        }
      );
    }

    await db
      .update(users)
      .set({ twoFactorEnabled: body.value })
      .where(eq(users.id, user.id));

    return NextResponse.json(
      { success: true, message: "Two Factor enabled for you." },
      {
        status: StatusCodes["OK"],
        statusText: "Two factor authentication enabled",
      }
    );
  },
  {
    logError: true,
  }
);
