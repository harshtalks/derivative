import { validateRequest } from "@/auth/validate-request";
import withError from "@/lib/sever/with-error";
import { StatusCodes } from "http-status-codes";
import { NextResponse } from "next/server";
import { User, Session } from "lucia";

export type ValidateGithubAuth = {
  user: User | null;
  session: Session | null;
};

export const GET = withError<ValidateGithubAuth | null>(async (request) => {
  const { session, user } = await validateRequest();

  const body = { user, session };

  return NextResponse.json(body, {
    status: StatusCodes["OK"],
    statusText: "OK",
  });
});
