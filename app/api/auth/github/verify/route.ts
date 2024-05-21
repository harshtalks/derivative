import { validateRequest } from "@/auth/validate-request";
import withError from "@/lib/sever/with-error";
import { StatusCodes } from "http-status-codes";
import { NextResponse } from "next/server";
import { ValidateGithubAuth } from "./route.info";

export const GET = withError<ValidateGithubAuth | null>(async (request) => {
  const { session, user } = await validateRequest();

  if (!user && !session) {
    return new NextResponse(null, {
      status: StatusCodes["UNAUTHORIZED"],
      statusText: "Unauthorized",
    });
  }

  const body = { user, session };

  return NextResponse.json(body, {
    status: StatusCodes["OK"],
    statusText: "OK",
  });
});
