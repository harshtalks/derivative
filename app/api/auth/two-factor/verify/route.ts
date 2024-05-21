import { COOKIE_NAME, verifyJWT } from "@/auth/tf";
import { validateRequest } from "@/auth/validate-request";
import withError from "@/lib/sever/with-error";
import { NullResponseType } from "@/types/api.type";
import { StatusCodes } from "http-status-codes";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = withError<NullResponseType>(
  async (request) => {
    const { user } = await validateRequest();

    if (!user) {
      return new NextResponse(null, {
        status: StatusCodes.UNAUTHORIZED,
        statusText: "Unauthorized",
      });
    }

    const webAuthCookie = cookies().get(COOKIE_NAME);

    if (!webAuthCookie) {
      return new NextResponse(null, {
        status: StatusCodes.UNAUTHORIZED,
        statusText: "Unauthorized",
      });
    }

    const validJWT = await verifyJWT(webAuthCookie.value);

    if (validJWT) {
      return NextResponse.json(
        { success: true, message: "Successfully verified the JWT" },
        {
          status: StatusCodes.OK,
          statusText: "Successfully verified the JWT",
        }
      );
    }

    return new NextResponse(null, {
      status: StatusCodes.UNAUTHORIZED,
      statusText: "Unauthorized",
    });
  },
  {
    error: (e) =>
      new NextResponse(null, {
        status: StatusCodes.UNAUTHORIZED,
        statusText: "Unauthorized",
      }),
  }
);
